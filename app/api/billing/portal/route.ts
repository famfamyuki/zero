import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { getApplicationOrigin, paidJson } from '@/lib/paid-architecture-review/http';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const config = parsePaidArchitectureReviewConfig();
    if (!config) return paidJson({ error: 'review_disabled' }, { status: 503 });
    const user = await authenticatePaidRequest(request);
    if (!user) return paidJson({ error: 'authentication_required' }, { status: 401 });
    const { data, error } = await getSupabaseAdmin().from('billing_customers').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (error || !data) return paidJson({ error: 'paid_entitlement_required' }, { status: 403 });
    const session = await getStripe().billingPortal.sessions.create({ customer: data.stripe_customer_id, configuration: config.portalConfigurationId, return_url: getApplicationOrigin() });
    return paidJson({ url: session.url });
  } catch {
    return paidJson({ error: 'billing_portal_unavailable' }, { status: 503 });
  }
}
