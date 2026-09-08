import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlanCard from "@/components/PlanCard";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { getCurrentUser } from "@/lib/session";
import { stripeEnabled } from "@/lib/stripe";

export const metadata = { title: "Tarifs — Brandy AI" };

const FAQ = [
  {
    q: "Que se passe-t-il quand j'atteins ma limite de projets ?",
    a: "Vos projets existants restent accessibles et modifiables. Pour en créer un nouveau, vous passez au plan supérieur — ou vous supprimez un projet dont vous n'avez plus besoin.",
  },
  {
    q: "Puis-je régénérer une section sans tout refaire ?",
    a: "Oui. Chaque section — audience, positionnement, palette, logo, typographies, ton de voix — se régénère indépendamment avec vos remarques, et le reste de l'identité reste cohérent.",
  },
  {
    q: "À qui appartiennent les livrables ?",
    a: "À vous. Les logos SVG, la palette, le brand book et l'export JSON sont votre propriété, exploitables commercialement sans restriction de notre part.",
  },
  {
    q: "Les polices proposées sont-elles utilisables commercialement ?",
    a: "Le directeur créatif ne propose que des polices réellement existantes et disponibles gratuitement (Google Fonts, Fontshare) ou dont la fonderie est nommée. Vérifiez toujours la licence avant un usage commercial.",
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
          Vous payez une capacité de production, pas des jetons.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-soft)]">
          Chaque plan ouvre un nombre de projets de marque. À l&apos;intérieur d&apos;un
          projet, vous régénérez autant de fois que nécessaire jusqu&apos;à ce que
          l&apos;identité soit juste.
        </p>

        {demoMode && (
          <p className="mt-8 rounded-xl border border-[var(--color-line)] bg-white/70 px-5 py-4 text-sm text-[var(--color-ink-soft)]">
            <strong className="font-bold text-[var(--color-ink)]">Mode démo :</strong>{" "}
            aucune clé Stripe n&apos;est configurée sur cette instance. Les changements de
            plan sont appliqués immédiatement, sans paiement réel.
          </p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <div key={item.q} className="border-t border-[var(--color-line)] pt-5">
                <h3 className="text-base">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
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
