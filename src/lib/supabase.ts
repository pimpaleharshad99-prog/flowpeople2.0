import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://cmjsjxtjijawgspklfxt.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_a9yC3a5rtjth-UmnUB53xA_uNOsdHK2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'flowpeople_supabase_auth',
  },
});

