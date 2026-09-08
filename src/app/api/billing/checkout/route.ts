import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { isPlanId, PLANS } from "@/lib/plans";
import { appUrl, getStripe, priceIdForPlan, stripeEnabled } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let payload: { plan?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const planId = payload.plan;
  if (!planId || !isPlanId(planId)) {
    return NextResponse.json({ error: "Plan inconnu." }, { status: 400 });
  }

  // Mode démo : sans clés Stripe, l'abonnement est activé localement pour
  // permettre d'essayer le produit de bout en bout.
  if (!stripeEnabled()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: planId, planStatus: "demo" },
    });
    return NextResponse.json({ demo: true, url: "/dashboard/billing?demo=1" });
  }

  const priceId = priceIdForPlan(planId);
  if (!priceId) {
    return NextResponse.json(
      { error: `Aucun tarif Stripe configuré pour le plan ${PLANS[planId].name}.` },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { userId: user.id, plan: planId },
    subscription_data: { metadata: { userId: user.id, plan: planId } },
    success_url: `${appUrl()}/dashboard/billing?success=1`,
    cancel_url: `${appUrl()}/pricing?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
