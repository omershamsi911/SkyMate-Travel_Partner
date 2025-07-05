import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_ANON_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase };
export default supabase;