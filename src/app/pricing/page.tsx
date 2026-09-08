import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlanCard from "@/components/PlanCard";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { getCurrentUser } from "@/lib/session";
import { stripeEnabled } from "@/lib/stripe";

export const metadata = { title: "Tarifs — Cally Leads" };

const FAQ = [
  {
    q: "Un lead écarté est-il compté dans mon quota ?",
    a: "Non. Seuls les leads qui passent vos règles de qualification sont décomptés. Les autres restent consultables dans une file séparée, sans consommer votre volume.",
  },
  {
    q: "Que se passe-t-il si je dépasse mon volume ?",
    a: "Rien ne se coupe. Vous continuez de recevoir vos leads et nous vous prévenons ; vous choisissez de passer au plan supérieur ou de rester en l'état jusqu'au mois suivant.",
  },
  {
    q: "Puis-je définir mes propres règles de qualification ?",
    a: "À partir du plan Studio, oui : budget, échéance, périmètre, fonction du contact, zone géographique. Le plan Solo utilise un jeu de règles standard que vous pouvez activer ou désactiver.",
  },
  {
    q: "Les données des prospects m'appartiennent-elles ?",
    a: "Oui. Vous exportez tout en CSV à tout moment, et la suppression de votre compte efface les enregistrements associés.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const demoMode = !stripeEnabled();

  return (
    <>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8">
        <h1 className="max-w-3xl text-[clamp(2.2rem,5.5vw,3.8rem)]">
          Vous payez les leads qui valent le coup de fil.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--color-encre-douce)]">
          Chaque offre ouvre un volume mensuel de leads qualifiés. Les demandes
          écartées par vos règles ne sont jamais décomptées.
        </p>

        {demoMode && (
          <p className="mt-8 rounded-xl border border-[var(--color-filet)] bg-white/70 px-5 py-4 text-sm text-[var(--color-encre-douce)]">
            <strong className="font-bold text-[var(--color-encre)]">Mode démo :</strong>{" "}
            aucune clé Stripe n&apos;est configurée sur cette instance. Les changements de
            plan sont appliqués immédiatement, sans paiement réel.
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLAN_ORDER.map((id) => (
            <PlanCard
              key={id}
              plan={PLANS[id]}
              currentPlan={user?.plan ?? null}
              authenticated={Boolean(user)}
            />
          ))}
        </div>

        <section className="mt-24">
          <h2 className="text-3xl">Questions fréquentes</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-[var(--color-filet)] pt-5">
                <h3 className="text-base">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-encre-douce)]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
