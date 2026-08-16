import Stripe from 'stripe';

let stripeClient: Stripe | undefined;

export function getStripe(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeClient ??= new Stripe(apiKey, {
    apiVersion: '2026-07-29.dahlia',
    appInfo: {
      name: 'AgentGraph Studio',
      version: '1.0.0',
    },
  });

  return stripeClient;
}
