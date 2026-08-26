import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { paidJson } from '@/lib/paid-architecture-review/http';
import { findAndReconcileUserSubscription } from '@/lib/paid-architecture-review/stripe-reconciliation';
import { readPaidArchitectureReviewAccess } from '@/lib/paid-architecture-review/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const refreshes = new Map<string, number>();
export async function POST(request: Request) {
  try {
    const config = parsePaidArchitectureReviewConfig();
    if (!config) return paidJson({ error: 'review_disabled' }, { status: 503 });
    const user = await authenticatePaidRequest(request);
    if (!user) return paidJson({ error: 'authentication_required' }, { status: 401 });
    const last = refreshes.get(user.id) ?? 0;
    if (Date.now() - last < 30_000) return paidJson({ error: 'rate_limited' }, { status: 429 });
    refreshes.set(user.id, Date.now());
    await findAndReconcileUserSubscription(user.id, config);
    return paidJson(await readPaidArchitectureReviewAccess(user.id, config));
  } catch {
    return paidJson({ error: 'entitlement_unavailable' }, { status: 503 });
  }
}
