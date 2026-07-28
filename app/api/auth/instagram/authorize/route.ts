import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getInstagramAuthUrl } from '@/lib/social/instagram'

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const authUrl = getInstagramAuthUrl(decoded.userId)
    if (!authUrl) {
      return NextResponse.json({
        error: 'Instagram non configurato. Le credenziali API mancanti.',
      }, { status: 503 })
    }

    return NextResponse.redirect(authUrl)
  } catch {
    return NextResponse.json({ error: 'Errore di autenticazione' }, { status: 401 })
  }
}
