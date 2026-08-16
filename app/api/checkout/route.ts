import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { PRESET_TEMPLATES } from '@/lib/presets';

function getCheckoutBaseUrl(): string {
  const configuredUrl = process.env.APP_BASE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined)
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined);

  if (!configuredUrl) {
    throw new Error('APP_BASE_URL is not configured');
  }

  const url = new URL(configuredUrl);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) {
    throw new Error('APP_BASE_URL must use HTTPS');
  }
  return url.origin;
}

export async function POST(req: Request) {
  try {
    const payload: unknown = await req.json().catch(() => null);
    if (!payload || typeof payload !== 'object' || typeof (payload as { templateId?: unknown }).templateId !== 'string') {
      return NextResponse.json({ error: 'templateId must be a string' }, { status: 400 });
    }
    const templateId = (payload as { templateId: string }).templateId;

    const template = PRESET_TEMPLATES.find((t) => t.id === templateId);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (!Number.isFinite(template.price) || template.price <= 0) {
      return NextResponse.json({ error: 'This template does not require checkout' }, { status: 400 });
    }

    const origin = getCheckoutBaseUrl();

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: template.title,
              description: template.description,
            },
            unit_amount: Math.round(template.price * 100), // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true&template_id=${template.id}`,
      cancel_url: `${origin}/templates`,
      metadata: {
        templateId: template.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
