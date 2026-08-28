import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/clients'
import User from '@/models/User'
import Notification from '@/models/Notification'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event: any

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      event = JSON.parse(body)
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const { planId, userId } = session.metadata || {}

      if (planId && userId) {
        const user = await User.findById(userId)
        if (user) {
          await User.updateById(user.id, { plan: planId })

          await Notification.create({
            userId: user.id,
            text: `Il tuo piano ${(planId as string).toUpperCase()} è ora attivo tramite Stripe Webhook! Grazie.`,
            type: 'success',
          })
          console.log(`User ${userId} successfully upgraded to ${planId} via webhook`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
