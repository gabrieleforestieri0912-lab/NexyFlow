import { NextResponse } from 'next/server'

const CODES: Record<string, { code: string; expiresAt: number }> = (globalThis as any)._verificationCodes || ((globalThis as any)._verificationCodes = {})

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()
    if (!email || !code) {
      return NextResponse.json({ error: 'Email e codice richiesti' }, { status: 400 })
    }

    const stored = CODES[email]
    if (!stored) {
      return NextResponse.json({ error: 'Nessun codice inviato a questa email' }, { status: 400 })
    }
    if (Date.now() > stored.expiresAt) {
      delete CODES[email]
      return NextResponse.json({ error: 'Codice scaduto. Richiedine uno nuovo.' }, { status: 400 })
    }
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Codice errato' }, { status: 400 })
    }

    delete CODES[email]

    return NextResponse.json({ verified: true, message: 'Codice verificato con successo' }, { status: 200 })
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
