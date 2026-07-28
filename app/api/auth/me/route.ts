import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import supabase from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }
    if (!token) {
      return NextResponse.json({ user: null })
    }

    let decoded: { userId: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    } catch {
      const res = NextResponse.json({ user: null })
      res.cookies.set('token', '', { maxAge: 0, path: '/' })
      return res
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, avatar, plan, daily_queries_count, last_query_date, connected_platforms, social_stats, language, created_at, updated_at')
      .eq('id', decoded.userId)
      .single()

    if (!user) {
      const res = NextResponse.json({ user: null })
      res.cookies.set('token', '', { maxAge: 0, path: '/' })
      return res
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
