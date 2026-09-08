import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getPlan, formatLimit } from "@/lib/plans";
import { stripeEnabled } from "@/lib/stripe";
import BillingActions from "@/components/BillingActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Abonnement — Cally Leads" };

type Props = { searchParams: Promise<{ success?: string; demo?: string }> };

export default async function BillingPage({ searchParams }: Props) {
  const user = await requireUser();
  const { success, demo } = await searchParams;
  const plan = getPlan(user.plan);
  const projectCount = await prisma.project.count({ where: { userId: user.id } });

  const usagePercent =
    plan.leadLimit === -1
      ? 0
      : Math.min(100, Math.round((projectCount / plan.leadLimit) * 100));

  return (
    <>
      <h1 className="text-4xl">Abonnement</h1>
      <p className="mt-3 text-[var(--color-encre-douce)]">
        Votre capacité de production et son utilisation.
      </p>

      {(success || demo) && (
        <p className="mt-8 rounded-xl border border-[var(--color-filet)] bg-white/70 px-5 py-4 text-sm text-[var(--color-encre-douce)]">
          {demo
            ? "Plan mis à jour en mode démo — aucun paiement n'a été effectué."
            : "Abonnement confirmé. Votre nouvelle capacité est active."}
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-8">
          <p className="label">Plan actuel</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-4">
            <h2 className="font-display-face text-4xl">{plan.name}</h2>
            <span className="text-lg text-[var(--color-encre-tenue)]">
              {plan.price === 0 ? "gratuit" : `${plan.price} € / mois`}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--color-encre-douce)]">{plan.tagline}</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold">
                {projectCount} projet{projectCount === 1 ? "" : "s"} utilisé
                {projectCount === 1 ? "" : "s"}
              </span>
              <span className="text-[var(--color-encre-tenue)]">
                sur {formatLimit(plan)}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-ivoire-creuse)]">
              <div
                className="h-full rounded-full bg-[var(--color-violet)] transition-all"
                style={{ width: `${plan.leadLimit === -1 ? 8 : usagePercent}%` }}
              />
            </div>
          </div>

          <div className="mt-8 rule pt-6">
            <BillingActions hasStripe={stripeEnabled() && Boolean(user.stripeCustomerId)} />
          </div>
        </div>

        <div className="card p-8">
          <p className="label">Détail</p>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-encre-tenue)]">Statut</dt>
              <dd className="font-bold">
                {user.planStatus === "demo" ? "démo" : user.planStatus}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-encre-tenue)]">Prochaine échéance</dt>
              <dd className="font-bold">
                {user.currentPeriodEnd
                  ? new Date(user.currentPeriodEnd).toLocaleDateString("fr-FR")
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-encre-tenue)]">Compte</dt>
              <dd className="font-bold">{user.email}</dd>
            </div>
          </dl>

          <p className="label mt-8">Inclus dans votre plan</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-encre-douce)]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <span className="mt-[0.4em] block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-violet)]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
