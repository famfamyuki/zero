import type { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization) return null;
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  return match?.[1] ?? null;
}
export async function authenticatePaidRequest(request: Request): Promise<User | null> {
  const token = readBearerToken(request);
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  return error ? null : data.user;
}
