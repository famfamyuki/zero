import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { getApplicationOrigin, paidJson } from '@/lib/paid-architecture-review/http';
import { readPaidArchitectureReviewAccess } from '@/lib/paid-architecture-review/access';
import { ensureStripeCustomer, isValidArchitectureReviewPrice } from '@/lib/paid-architecture-review/stripe-reconciliation';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const config = parsePaidArchitectureReviewConfig();
    if (!config) return paidJson({ error: 'review_disabled' }, { status: 503 });
    const user = await authenticatePaidRequest(request);
    if (!user) return paidJson({ error: 'authentication_required' }, { status: 401 });
    const idempotencyKey = request.headers.get('idempotency-key');
    if (!idempotencyKey || !UUID.test(idempotencyKey)) return paidJson({ error: 'invalid_idempotency_key' }, { status: 400 });
    const access = await readPaidArchitectureReviewAccess(user.id, config);
    if (access.state === 'active' || access.state === 'active_canceling' || access.state === 'quota_exhausted') return paidJson({ error: 'subscription_exists', manageBilling: true }, { status: 409 });
    if (access.state === 'sync_degraded') return paidJson({ error: 'entitlement_unavailable' }, { status: 503 });
    const price = await getStripe().prices.retrieve(config.stripePriceId);
    if (!isValidArchitectureReviewPrice(price)) return paidJson({ error: 'review_disabled' }, { status: 503 });
    const customer = await ensureStripeCustomer(user.id);
    const origin = getApplicationOrigin();
    const metadata = { kind: 'architecture_review_subscription_v0', plan_key: config.planKey, user_id: user.id };
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription', customer, client_reference_id: user.id, line_items: [{ price: config.stripePriceId, quantity: 1 }],
      success_url: `${origin}/?architecture_review_checkout=success`, cancel_url: `${origin}/?architecture_review_checkout=cancel`,
      metadata, subscription_data: { metadata }, allow_promotion_codes: false,
    }, { idempotencyKey });
    return paidJson({ url: session.url });
  } catch {
    return paidJson({ error: 'checkout_unavailable' }, { status: 503 });
  }
}
