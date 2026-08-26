import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { reconcileArchitectureReviewSubscription } from '@/lib/paid-architecture-review/stripe-reconciliation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function subscriptionIdFromEvent(event: Stripe.Event): string | null {
  if (event.type.startsWith('customer.subscription.')) return (event.data.object as Stripe.Subscription).id;
  if (event.type.startsWith('invoice.')) {
    const invoice = event.data.object as Stripe.Invoice;
    const parent = invoice.parent?.subscription_details?.subscription;
    return typeof parent === 'string' ? parent : parent?.id ?? null;
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    return typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null;
  }
  return null;
}

async function claimWebhook(event: Stripe.Event): Promise<'claimed' | 'processed'> {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from('stripe_webhook_events').select('state').eq('event_id', event.id).maybeSingle();
  if (data?.state === 'processed') return 'processed';
  const row = { event_id: event.id, event_type: event.type, state: 'processing' as const, event_created_at: new Date(event.created * 1000).toISOString(), updated_at: new Date().toISOString(), failure_category: null };
  const { error } = data
    ? await admin.from('stripe_webhook_events').update(row).eq('event_id', event.id)
    : await admin.from('stripe_webhook_events').insert(row);
  if (error) throw new Error('webhook_dedupe_unavailable');
  return 'claimed';
}

async function markWebhook(eventId: string, state: 'processed' | 'failed', failureCategory: string | null) {
  await getSupabaseAdmin().from('stripe_webhook_events').update({ state, failure_category: failureCategory, processed_at: state === 'processed' ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq('event_id', eventId);
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature) return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  if (!secret) return NextResponse.json({ error: 'webhook_unavailable' }, { status: 503 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'payment' && session.metadata?.templateId) {
        const { error } = await getSupabaseAdmin().from('purchases').upsert({ stripe_session_id: session.id, template_id: session.metadata.templateId, amount: session.amount_total, customer_email: session.customer_details?.email ?? null, created_at: new Date().toISOString() }, { onConflict: 'stripe_session_id' });
        if (error) throw new Error('template_purchase_record_failed');
        return NextResponse.json({ received: true });
      }
    }
    if (await claimWebhook(event) === 'processed') return NextResponse.json({ received: true });
    const subscriptionId = subscriptionIdFromEvent(event);
    if (subscriptionId) {
      const config = parsePaidArchitectureReviewConfig(process.env, { allowDisabled: true });
      if (!config) throw new Error('paid_reconciliation_config_invalid');
      await reconcileArchitectureReviewSubscription(subscriptionId, event.id, config);
    }
    await markWebhook(event.id, 'processed', null);
    return NextResponse.json({ received: true });
  } catch {
    if (event.type === 'checkout.session.completed' && (event.data.object as Stripe.Checkout.Session).mode === 'payment') {
      return NextResponse.json({ error: 'purchase_processing_failed' }, { status: 500 });
    }
    const subscriptionId = subscriptionIdFromEvent(event);
    if (subscriptionId) await getSupabaseAdmin().from('architecture_review_entitlements').update({ sync_state: 'degraded', last_stripe_event_id: event.id, last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('stripe_subscription_id', subscriptionId);
    await markWebhook(event.id, 'failed', 'reconciliation_failed');
    return NextResponse.json({ error: 'webhook_processing_failed' }, { status: 500 });
  }
}
