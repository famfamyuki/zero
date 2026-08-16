import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { PRESET_TEMPLATES } from '@/lib/presets';

export async function POST(req: Request) {
  try {
    const { templateId } = await req.json();

    const template = PRESET_TEMPLATES.find((t) => t.id === templateId);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

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
