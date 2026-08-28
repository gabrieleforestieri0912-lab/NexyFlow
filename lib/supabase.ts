import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (cached) return cached

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL non configurata correttamente. ' +
        'Imposta le Environment Variables su Vercel (o nel file .env).'
    )
  }

  if (!supabaseKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY non configurata. ' +
        'Imposta le Environment Variables su Vercel (o nel file .env).'
    )
  }

  cached = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })
  return cached
}

const handler: ProxyHandler<SupabaseClient> = {
  get(_target, prop, _receiver) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
}

const supabase = new Proxy({} as SupabaseClient, handler)

export default supabase
