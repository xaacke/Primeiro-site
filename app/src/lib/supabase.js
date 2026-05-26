import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente configurado para o schema techstock
export const supabaseTechstock = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'techstock' },
})
