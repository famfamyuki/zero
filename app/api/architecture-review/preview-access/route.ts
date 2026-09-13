import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { paidJson } from '@/lib/paid-architecture-review/http';
import { isArchitectureReviewPreviewTester, parseArchitectureReviewPreviewConfig } from '@/lib/architecture-review/preview-test';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!parseArchitectureReviewPreviewConfig()) return paidJson({ enabled: false, allowed: false });
  try {
    const user = await authenticatePaidRequest(request);
    return paidJson({ enabled: true, allowed: isArchitectureReviewPreviewTester(user?.id ?? null) });
  } catch {
    return paidJson({ enabled: true, allowed: false }, { status: 503 });
  }
}
