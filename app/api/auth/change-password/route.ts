import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Inserisci la password attuale e la nuova password' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'La nuova password deve essere di almeno 6 caratteri' },
        { status: 400 }
      )
    }

    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'Account senza password (login social). Imposta una password dalla sezione sicurezza.' },
        { status: 400 }
      )
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password attuale errata' },
        { status: 401 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await User.updateById(user.id, { password: hashedPassword })

    return NextResponse.json(
      { message: 'Password aggiornata con successo' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Change password error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
