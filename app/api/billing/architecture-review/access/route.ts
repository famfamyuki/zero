import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { readPaidArchitectureReviewAccess } from '@/lib/paid-architecture-review/access';
import { paidJson } from '@/lib/paid-architecture-review/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await authenticatePaidRequest(request);
    if (!user) return paidJson({ error: 'authentication_required' }, { status: 401 });
    return paidJson(await readPaidArchitectureReviewAccess(user.id, parsePaidArchitectureReviewConfig()));
  } catch {
    return paidJson({ version: '0.1.0', state: 'sync_degraded', quota: null, cancelAtPeriodEnd: false }, { status: 503 });
  }
}
