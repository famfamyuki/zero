import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-27' as any,
  appInfo: {
    name: 'AgentGraph Studio',
    version: '1.0.0',
  },
});
