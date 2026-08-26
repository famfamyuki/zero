import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ARCHITECTURE_REVIEW_PLAN_KEY } from '@/types/paid-architecture-review';
import type { PaidArchitectureReviewConfig } from './config';

function subscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  if (!item) throw new Error('subscription_item_missing');
  return { start: new Date(item.current_period_start * 1000).toISOString(), end: new Date(item.current_period_end * 1000).toISOString() };
}

export async function reconcileArchitectureReviewSubscription(subscriptionId: string, eventId: string | null, config: PaidArchitectureReviewConfig) {
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId, { expand: ['items.data.price'] });
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const admin = getSupabaseAdmin();
  const { data: customer, error: customerError } = await admin.from('billing_customers').select('user_id').eq('stripe_customer_id', customerId).maybeSingle();
  if (customerError || !customer) throw new Error('billing_customer_not_mapped');
  const matchingItems = subscription.items.data.filter((item) => item.price.id === config.stripePriceId);
  if (matchingItems.length !== 1 || subscription.items.data.length !== 1) {
    await admin.from('architecture_review_entitlements').update({ sync_state: 'degraded', last_synced_at: new Date().toISOString() }).eq('user_id', customer.user_id);
    throw new Error('subscription_shape_invalid');
  }
  const { data: existing } = await admin.from('architecture_review_entitlements').select('stripe_subscription_id,stripe_status').eq('user_id', customer.user_id).maybeSingle();
  if (existing && existing.stripe_subscription_id !== subscription.id && existing.stripe_status === 'active' && subscription.status === 'active') {
    await admin.from('architecture_review_entitlements').update({ sync_state: 'degraded', last_stripe_event_id: eventId, last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('user_id', customer.user_id);
    throw new Error('duplicate_active_subscription');
  }
  const { start, end } = subscriptionPeriod(subscription);
  const { error } = await admin.from('architecture_review_entitlements').upsert({
    user_id: customer.user_id, plan_key: ARCHITECTURE_REVIEW_PLAN_KEY, stripe_subscription_id: subscription.id,
    stripe_price_id: matchingItems[0].price.id, stripe_status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end, current_period_start: start, current_period_end: end,
    sync_state: 'healthy', last_stripe_event_id: eventId, last_synced_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw new Error('entitlement_reconciliation_failed');
  return subscription;
}

export async function findAndReconcileUserSubscription(userId: string, config: PaidArchitectureReviewConfig) {
  const admin = getSupabaseAdmin();
  const { data: mapping, error } = await admin.from('billing_customers').select('stripe_customer_id').eq('user_id', userId).maybeSingle();
  if (error || !mapping) return null;
  const subscriptions = await getStripe().subscriptions.list({ customer: mapping.stripe_customer_id, status: 'all', limit: 20, expand: ['data.items.data.price'] });
  const matching = subscriptions.data.filter((subscription) => subscription.items.data.some((item) => item.price.id === config.stripePriceId));
  const eligible = matching.filter((subscription) => subscription.status === 'active');
  if (eligible.length > 1) {
    await admin.from('architecture_review_entitlements').update({ sync_state: 'degraded', last_synced_at: new Date().toISOString() }).eq('user_id', userId);
    throw new Error('duplicate_active_subscription');
  }
  const selected = eligible[0] ?? matching.sort((a, b) => b.created - a.created)[0];
  return selected ? reconcileArchitectureReviewSubscription(selected.id, null, config) : null;
}

export async function ensureStripeCustomer(userId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from('billing_customers').select('stripe_customer_id').eq('user_id', userId).maybeSingle();
  if (error) throw new Error('billing_customer_lookup_failed');
  if (data) return data.stripe_customer_id;
  const customer = await getStripe().customers.create({ metadata: { kind: 'architecture_review_customer_v0', user_id: userId } }, { idempotencyKey: `architecture-review-customer-${userId}` });
  const { error: insertError } = await admin.from('billing_customers').insert({ user_id: userId, stripe_customer_id: customer.id });
  if (insertError) {
    const { data: raced } = await admin.from('billing_customers').select('stripe_customer_id').eq('user_id', userId).single();
    if (raced) return raced.stripe_customer_id;
    throw new Error('billing_customer_mapping_failed');
  }
  return customer.id;
}
