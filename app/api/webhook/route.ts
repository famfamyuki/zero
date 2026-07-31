import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    console.log('Payment checkout session completed for template:', session.metadata?.templateId);

    // Record purchase transaction in Supabase if purchases table exists
    try {
      await supabase.from('purchases').insert([
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
