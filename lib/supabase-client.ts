'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (cached) return cached

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY non configurate.'
    )
  }

  cached = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return cached
}

const handler: ProxyHandler<SupabaseClient> = {
  get(_target, prop, _receiver) {
    const client = getClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
}

export const supabaseClient = new Proxy({} as SupabaseClient, handler)
