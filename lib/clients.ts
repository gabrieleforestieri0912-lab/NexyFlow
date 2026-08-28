import Stripe from 'stripe'
import { Resend } from 'resend'

let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY non configurata.')
    _stripe = new Stripe(key)
  }
  return _stripe
}

let _resend: Resend | null = null
export function getResend(): Resend | null {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) return null
    _resend = new Resend(key)
  }
  return _resend
}
