import Stripe from 'stripe';
import { inspectPaidArchitectureReviewReadiness } from '../lib/paid-architecture-review/config';
import { isValidArchitectureReviewPrice } from '../lib/paid-architecture-review/stripe-reconciliation';

async function main() {
  const readiness = inspectPaidArchitectureReviewReadiness(process.env, { target: 'test' });
  if (!readiness.configurationReady || !readiness.config) {
    console.error('BLOCKED: Test Mode configuration is incomplete. Run npm run commercial:check:test for bounded diagnostics.');
    process.exitCode = 1;
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY ?? '';
  if (!/^(?:sk|rk)_test_/.test(secretKey)) {
    console.error('BLOCKED: STRIPE_SECRET_KEY is not a Stripe Test Mode key.');
    process.exitCode = 1;
    return;
  }

  const stripe = new Stripe(secretKey);
  const [price, portal] = await Promise.all([
    stripe.prices.retrieve(readiness.config.stripePriceId),
    stripe.billingPortal.configurations.retrieve(readiness.config.portalConfigurationId),
  ]);

  if (!isValidArchitectureReviewPrice(price, readiness.config)) {
    console.error('BLOCKED: Stripe Test Mode Price does not match USD 12.00 monthly licensed single-price contract.');
    process.exitCode = 1;
    return;
  }

  const cancellation = portal.features.subscription_cancel;
  const invoices = portal.features.invoice_history;
  const paymentMethods = portal.features.payment_method_update;
  if (!portal.active || !cancellation.enabled || cancellation.mode !== 'at_period_end' || !invoices.enabled || !paymentMethods.enabled
    || portal.features.subscription_update.enabled) {
    console.error('BLOCKED: Customer Portal does not match cancel-at-period-end, invoice, payment-method, and no-plan-switch contract.');
    process.exitCode = 1;
    return;
  }

  console.log('PASS: Stripe Test Mode Price and Customer Portal match the launch-candidate contract.');
}

void main().catch(() => {
  console.error('BLOCKED: Stripe Test Mode verification could not complete.');
  process.exitCode = 1;
});
