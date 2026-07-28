import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL non configurata correttamente. ' +
    'Aggiorna il file .env con l\'URL del tuo progetto Supabase.'
  )
}

if (!supabaseKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY non configurata. ' +
    'Aggiorna il file .env con la Service Role Key del tuo progetto Supabase.'
  )
}

let cached = globalThis._supabase

if (!cached) {
  cached = globalThis._supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })
}

export default cached
