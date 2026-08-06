import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      console.error('No token provided')
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    console.log('Token received, length:', token.length)
    console.log('Token prefix:', token.substring(0, 50))

    // Try to decode the ID token (JWT) to get user info
    let decoded
    try {
      decoded = jwt.decode(token)
    } catch (decodeError) {
      console.error('JWT decode error:', decodeError)
      // If decode fails, try to fetch from Google userinfo endpoint
      try {
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (googleRes.ok) {
          decoded = await googleRes.json()
          console.log('Fetched user info from Google:', decoded)
        } else {
          console.error('Google userinfo fetch failed:', googleRes.status)
          return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 })
        }
      } catch (fetchError) {
        console.error('Google userinfo fetch error:', fetchError)
        return NextResponse.json({ error: 'Failed to fetch user info from Google' }, { status: 401 })
      }
    }

    console.log('Decoded/Retrieved user info:', JSON.stringify(decoded, null, 2))

    if (!decoded || !decoded.email) {
      console.error('No email in user info:', decoded)
      return NextResponse.json({ error: 'Invalid Google token - no email found' }, { status: 401 })
    }

    const email = decoded.email
    const name = decoded.name || email.split('@')[0]
    const picture = decoded.picture || ''

    console.log('User info extracted:', { email, name, hasPicture: !!picture })

    let user = await User.findOne({ email })

    if (!user) {
      console.log('Creating new user:', email)
      user = await User.create({
        name,
        email,
        avatar: picture,
        connected_platforms: { instagram: false, tiktok: false, youtube: false },
      })

      if (!user) {
        console.error('Failed to create user')
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      console.log('User created successfully:', user.id)
    } else {
      console.log('Existing user found:', user.id)
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      {
        message: 'Google Login successful',
        token: jwtToken,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, plan: user.plan },
      },
      { status: 200 }
    )

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    console.log('Login successful for:', email)
    return response
  } catch (error: any) {
    console.error('Google Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed: ' + error.message },
      { status: 500 }
    )
  }
}
