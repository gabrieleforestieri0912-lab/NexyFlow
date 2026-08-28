import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { error } = await supabase
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', decoded.userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
