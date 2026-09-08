import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { LogoMark } from "@/components/Logo";
import { PLANS, PLAN_ORDER, formatQuota } from "@/lib/plans";

const STEPS = [
  {
    title: "Le formulaire capte",
    body: "Vous posez le widget sur votre site. Il remplace votre formulaire de contact et pose les questions qui séparent un curieux d'un acheteur.",
  },
  {
    title: "La qualification trie",
    body: "Chaque demande reçoit un score : budget, échéance, périmètre, décideur. Vos règles, pas les nôtres.",
  },
  {
    title: "Vous rappelez",
    body: "Les leads qualifiés arrivent notés et attribués. Le reste part dans une file que vous traitez quand vous avez le temps — ou jamais.",
  },
];

const PROOF = [
  { label: "Questions posées avant le rendez-vous", value: "6" },
  { label: "Champs remontés dans votre CRM", value: "18" },
  { label: "Délai de notification", value: "< 1 min" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-filet)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-violet)]">
            Qualification des leads entrants
          </p>

          <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,5rem)]">
            Vous ne manquez pas de leads.
            <br />
            Vous manquez de{" "}
            <span className="strong">bons</span> leads.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-encre-douce)]">
            Cally Leads pose les bonnes questions avant que le rendez-vous soit
            pris. Vous ne rappelez que les prospects qui ont un budget, une
            échéance et le pouvoir de signer.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn btn-primary px-7 py-3.5 text-base">
              Essayer gratuitement
            </Link>
            <Link href="/pricing" className="btn btn-ghost px-7 py-3.5 text-base">
              Voir les tarifs
            </Link>
          </div>

          <p className="mt-5 text-sm text-[var(--color-encre-tenue)]">
            14 jours d&apos;essai, sans carte bancaire.
          </p>

          {/* Aperçu d'un lead qualifié */}
          <div className="card mt-16 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-filet)] px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-encre-tenue)]">
                Un lead tel qu&apos;il vous arrive
              </span>
              <span className="rounded-full bg-[var(--color-violet)] px-3 py-1 text-xs font-bold text-[var(--color-ivoire)]">
                Score 87
              </span>
            </div>

            <div className="grid gap-px bg-[var(--color-filet)] sm:grid-cols-3">
              {[
                { k: "Budget annoncé", v: "12 000 – 20 000 €" },
                { k: "Échéance", v: "Ce trimestre" },
                { k: "Décideur", v: "Oui — directrice associée" },
                { k: "Source", v: "Page tarifs" },
                { k: "Périmètre", v: "Refonte complète, 40 pages" },
                { k: "Attribué à", v: "Sophie M." },
              ].map((row) => (
                <div key={row.k} className="bg-[var(--color-surface)] p-5">
                  <p className="label">{row.k}</p>
                  <p className="mt-1 text-[0.95rem] font-medium">{row.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chiffres */}
        <section className="border-y border-[var(--color-filet)] bg-[var(--color-ivoire-creuse)]">
          <div className="mx-auto grid max-w-6xl gap-px bg-[var(--color-filet)] px-0 sm:grid-cols-3">
            {PROOF.map((p) => (
              <div key={p.label} className="bg-[var(--color-ivoire-creuse)] px-6 py-10">
                <p className="font-display-face text-4xl text-[var(--color-violet)]">
                  {p.value}
                </p>
                <p className="mt-2 text-sm text-[var(--color-encre-douce)]">{p.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Méthode */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl sm:text-4xl">
            Trois étapes, <span className="strong">aucune de plus</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-encre-douce)]">
            Le formulaire est déjà sur votre site. Ce qui change, c&apos;est ce
            qu&apos;il en fait.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-filet)] bg-[var(--color-filet)] md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-[var(--color-surface)] p-8">
                <p className="font-display-face text-3xl text-[var(--color-violet)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-encre-douce)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tarifs — trois cases */}
        <section className="border-t border-[var(--color-filet)] bg-[var(--color-surface)] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl sm:text-4xl">Trois offres, rien de caché</h2>
            <p className="mt-3 max-w-2xl text-[var(--color-encre-douce)]">
              Vous payez au volume de leads qualifiés. Les leads écartés ne sont
              jamais comptés.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PLAN_ORDER.map((id) => {
                const plan = PLANS[id];
                return (
                  <div
                    key={id}
                    className={`card flex flex-col p-7 ${
                      plan.highlight
                        ? "border-[var(--color-violet)] ring-1 ring-[var(--color-violet)]"
                        : ""
                    }`}
                  >
                    {plan.highlight && (
                      <span className="mb-3 self-start rounded-full bg-[var(--color-violet)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ivoire)]">
                        Le plus choisi
                      </span>
                    )}
                    <h3 className="text-xl">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[var(--color-encre-tenue)]">
                      {plan.tagline}
                    </p>
                    <p className="mt-6 font-display-face text-5xl leading-none">
                      {plan.price} €
                      <span className="text-sm font-normal text-[var(--color-encre-tenue)]">
                        {" "}
                        / mois
                      </span>
                    </p>
                    <p className="mt-3 text-sm font-bold text-[var(--color-violet)]">
                      {formatQuota(plan)}
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--color-encre-douce)]">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <span className="mt-[0.4em] block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-violet)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/pricing"
                      className={`btn mt-7 w-full py-3 ${
                        plan.highlight ? "btn-primary" : "btn-ghost"
                      }`}
                    >
                      Choisir {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Appel à l'action de bas de page */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-[var(--radius-xl2)] bg-[var(--color-violet)] px-8 py-20 text-center text-[var(--color-ivoire)]">
            <LogoMark className="mx-auto h-10 text-[var(--color-ivoire)]" />
            <h2 className="mx-auto mt-8 max-w-2xl text-3xl text-[var(--color-ivoire)] sm:text-4xl">
              Arrêtez de rappeler des gens qui ne signeront pas.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-ivoire)]/75">
              Posez le widget en dix minutes. Les premiers leads qualifiés
              arrivent le jour même.
            </p>
            <Link
              href="/register"
              className="btn btn-on-violet mt-9 px-8 py-3.5 text-base"
            >
              Essayer gratuitement
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
