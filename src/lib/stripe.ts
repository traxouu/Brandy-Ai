import "server-only";
import Stripe from "stripe";
import { PLANS, type PlanId } from "@/lib/plans";

let stripe: Stripe | null = null;

export function stripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe() {
  if (!stripeEnabled()) {
    throw new Error("Stripe n'est pas configuré sur ce serveur.");
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return stripe;
}

export function priceIdForPlan(planId: PlanId): string | null {
  const key = PLANS[planId].priceEnvKey;
  if (!key) return null;
  return process.env[key]?.trim() || null;
}

export function planIdForPrice(priceId: string): PlanId | null {
  for (const plan of Object.values(PLANS)) {
    if (!plan.priceEnvKey) continue;
    if (process.env[plan.priceEnvKey]?.trim() === priceId) return plan.id;
  }
  return null;
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
