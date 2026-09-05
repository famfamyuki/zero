import { getSupabaseAdmin } from '@/lib/supabase-admin';

const BILLING_REFRESH_WINDOW_SECONDS = 30;
const BILLING_REFRESH_LIMIT = 1;

export async function claimBillingRefresh(userId: string) {
  const { data, error } = await getSupabaseAdmin().rpc('claim_architecture_review_billing_refresh', {
    p_user_id: userId,
    p_window_seconds: BILLING_REFRESH_WINDOW_SECONDS,
    p_request_limit: BILLING_REFRESH_LIMIT,
  });
  if (error || typeof data !== 'boolean') throw new Error('refresh_rate_limit_unavailable');
  return data;
}
