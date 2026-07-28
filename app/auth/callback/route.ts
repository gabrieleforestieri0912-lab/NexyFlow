import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.user) {
      console.error('Supabase code exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const { email, user_metadata } = data.user
    const name = user_metadata?.full_name || user_metadata?.name || email?.split('@')[0] || 'User'
    const picture = user_metadata?.avatar_url || user_metadata?.picture || ''

    if (!email) {
      return NextResponse.redirect(`${origin}/login?error=no_email`)
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        connected_platforms: { instagram: false, tiktok: false, youtube: false },
      })

      if (!user) {
        return NextResponse.redirect(`${origin}/login?error=create_failed`)
      }
    } else if (picture && picture !== user.avatar) {
      await User.updateById(user.id, { avatar: picture, name: name !== email?.split('@')[0] ? name : user.name })
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.redirect(`${origin}/`)

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(`${origin}/login?error=unknown`)
  }
}
