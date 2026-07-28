import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import User from '@/models/User'

const CODES: Record<string, { code: string; expiresAt: number }> = (globalThis as any)._verificationCodes || ((globalThis as any)._verificationCodes = {})

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json()
    if (!email || !code || !password) {
      return NextResponse.json({ error: 'Email, codice e password richiesti' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La password deve essere di almeno 6 caratteri' }, { status: 400 })
    }

    const stored = CODES[email]
    if (!stored) {
      return NextResponse.json({ error: 'Richiedi prima un codice di verifica' }, { status: 400 })
    }
    if (Date.now() > stored.expiresAt) {
      delete CODES[email]
      return NextResponse.json({ error: 'Codice scaduto. Richiedine uno nuovo.' }, { status: 400 })
    }
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Codice errato' }, { status: 400 })
    }

    delete CODES[email]

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.updateById(user.id, { password: hashedPassword })

    return NextResponse.json({ message: 'Password reimpostata con successo' }, { status: 200 })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Errore durante il reset della password' }, { status: 500 })
  }
}
