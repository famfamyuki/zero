import { getStripe } from '@/lib/stripe';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { paidJson } from '@/lib/paid-architecture-review/http';
import { ARCHITECTURE_REVIEW_PLAN_KEY, PAID_ARCHITECTURE_REVIEW_VERSION } from '@/types/paid-architecture-review';
import { isValidArchitectureReviewPrice } from '@/lib/paid-architecture-review/stripe-reconciliation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const unavailable = () => paidJson({ version: PAID_ARCHITECTURE_REVIEW_VERSION, planKey: ARCHITECTURE_REVIEW_PLAN_KEY, displayName: 'Architecture Review', enabled: false, price: null, includedReviews: null, policyUrls: null });

export async function GET() {
  const config = parsePaidArchitectureReviewConfig();
  if (!config) return unavailable();
  try {
    const price = await getStripe().prices.retrieve(config.stripePriceId);
    if (!isValidArchitectureReviewPrice(price, config)) return unavailable();
    return paidJson({ version: PAID_ARCHITECTURE_REVIEW_VERSION, planKey: config.planKey, displayName: 'Architecture Review', enabled: true, price: { currency: price.currency, unitAmount: price.unit_amount!, interval: 'month' }, includedReviews: config.includedReviews, policyUrls: { terms: config.termsUrl, privacy: config.privacyUrl, support: config.supportUrl } });
  } catch {
    return unavailable();
  }
}
