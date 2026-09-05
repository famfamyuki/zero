import { NextResponse } from 'next/server';

export const PAID_NO_STORE_HEADERS = { 'Cache-Control': 'no-store' } as const;

export function paidJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...PAID_NO_STORE_HEADERS, ...init?.headers },
  });
}
export function getApplicationOrigin(): string {
  const configured = process.env.APP_BASE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null);
  if (!configured) throw new Error('application_origin_unavailable');
  const url = new URL(configured);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) {
    throw new Error('application_origin_invalid');
  }
  return url.origin;
}
