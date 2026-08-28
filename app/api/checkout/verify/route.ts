import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/clients'
import User from '@/models/User'
import Notification from '@/models/Notification'

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Session not paid yet' }, { status: 400 })
    }

    const { planId, userId } = session.metadata || {}

    if (!planId || !userId) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await User.updateById(user.id, { plan: planId as 'free' | 'pro' | 'business' | 'enterprise' })

    await Notification.create({
      userId: user.id,
      text: `Il tuo piano ${(planId as string).toUpperCase()} è ora attivo! Grazie per aver scelto Nexyflow.`,
      type: 'success',
    })

    return NextResponse.json({ success: true, plan: planId })
  } catch (error: any) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
