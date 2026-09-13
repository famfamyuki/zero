import { parseArchitectureReviewProviderConfig } from '@/lib/paid-architecture-review/config';

// Server route imports only. Never return the environment or allowlist to clients.
export function isArchitectureReviewPreviewTestEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV === 'preview'
    && Boolean(env.VERCEL_GIT_COMMIT_REF?.trim())
    && !['main', 'refs/heads/main'].includes(env.VERCEL_GIT_COMMIT_REF?.trim() ?? '')
    && env.ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED === 'true';
}

export function isArchitectureReviewPreviewTester(userId: string | null, env: Record<string, string | undefined> = process.env): boolean {
  if (!isArchitectureReviewPreviewTestEnabled(env) || !userId) return false;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuid.test(userId)) return false;
  return (env.ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS ?? '').split(',')
    .some((entry) => uuid.test(entry.trim()) && entry.trim().toLowerCase() === userId.toLowerCase());
}

export function parseArchitectureReviewPreviewConfig(env: Record<string, string | undefined> = process.env) {
  return isArchitectureReviewPreviewTestEnabled(env) ? parseArchitectureReviewProviderConfig(env) : null;
}
