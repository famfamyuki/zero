import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Payment checkout session completed for template:', session.metadata?.templateId);

    // Record purchase transaction in Supabase if purchases table exists
    try {
      await getSupabase().from('purchases').insert([
        {
          stripe_session_id: session.id,
          template_id: session.metadata?.templateId,
          amount: session.amount_total,
          customer_email: session.customer_details?.email,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (dbErr) {
      console.log('Database logging notice:', dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
