import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe, planIdForPrice, stripeEnabled } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET manquant." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      if (userId && typeof session.subscription === "string") {
        const subscription = await getStripe().subscriptions.retrieve(session.subscription);
        await applySubscription(userId, subscription);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const userId = await resolveUserId(subscription);
      if (userId) await applySubscription(userId, subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = await resolveUserId(subscription);
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "free",
            planStatus: "canceled",
            stripeSubscriptionId: null,
            currentPeriodEnd: null,
          },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function resolveUserId(subscription: Stripe.Subscription) {
  const fromMetadata = subscription.metadata?.userId;
  if (fromMetadata) return fromMetadata;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  return user?.id ?? null;
}

async function applySubscription(userId: string, subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  const planId =
    (subscription.metadata?.plan as string | undefined) ??
    (item?.price?.id ? planIdForPrice(item.price.id) : null);

  const active = ["active", "trialing", "past_due"].includes(subscription.status);
  const periodEnd = item?.current_period_end ?? null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: active && planId ? planId : "free",
      planStatus: subscription.status,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    },
  });
}
