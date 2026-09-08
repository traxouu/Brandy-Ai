import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { appUrl, getStripe, stripeEnabled } from "@/lib/stripe";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  if (!stripeEnabled() || !user.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe actif sur ce compte." },
      { status: 400 }
    );
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
