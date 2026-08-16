import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient<any>> | undefined;

export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  if (!supabaseClient) {
    supabaseClient = createClient<any>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}
