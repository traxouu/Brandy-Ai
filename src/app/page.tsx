import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PLANS, PLAN_ORDER, formatLimit } from "@/lib/plans";

const DELIVERABLES = [
  {
    title: "Audience",
    body: "Deux à trois personas construits sur des tensions réelles : objectifs, frustrations, déclencheurs d'achat, canaux où les atteindre.",
  },
  {
    title: "Positionnement",
    body: "Une phrase de positionnement, une proposition de valeur, des accroches candidates et l'angle qui vous sépare de vos concurrents.",
  },
  {
    title: "Logo",
    body: "Un wordmark et un monogramme livrés en SVG vectoriel, avec la note de construction, la zone de respiration et les usages interdits.",
  },
  {
    title: "Palette de couleurs",
    body: "Quatre à six couleurs, chacune avec son rôle, son usage et sa note de contraste. Une palette qui se défend, pas un dégradé à la mode.",
  },
  {
    title: "Typographies",
    body: "Un système de deux à trois polices réellement disponibles, avec la hiérarchie complète et les tailles recommandées.",
  },
  {
    title: "Ton de voix",
    body: "Les attributs de ton, les règles à suivre, les pièges à éviter, et des exemples de titre et de paragraphe écrits pour votre marque.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Vous briefez",
    body: "Nom, secteur, offre, marché, positionnement tarifaire, intentions visuelles. Dix minutes, pas plus.",
  },
  {
    step: "02",
    title: "L'IA dirige",
    body: "Le modèle raisonne comme un directeur artistique senior : il part de l'audience, choisit un territoire et l'assume.",
  },
  {
    step: "03",
    title: "Vous arbitrez",
    body: "Chaque section se régénère indépendamment, avec vos remarques. Le reste de l'identité reste cohérent.",
  },
  {
    step: "04",
    title: "Vous livrez",
    body: "Brand book imprimable, SVG des logos, tokens CSS et export JSON. De quoi briefer un dev ou un imprimeur.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-16">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-brand)]">
            Direction artistique augmentée
          </p>

          <h1 className="max-w-4xl text-[clamp(2.6rem,7.5vw,5.4rem)]">
            Votre marque mérite
            <br />
            un <span className="font-logo italic text-[var(--color-brand)]">directeur créatif</span>.
            <br />
            Pas un générateur.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Brandy AI construit l&apos;identité complète de votre marque à partir d&apos;un
            brief : audience, positionnement, logo vectoriel, palette de couleurs,
            typographies et ton de voix. Chaque choix est argumenté, comme en agence.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn btn-primary px-7 py-3.5 text-base">
              Créer ma première marque
            </Link>
            <Link href="/pricing" className="btn btn-ghost px-7 py-3.5 text-base">
              Voir les tarifs
            </Link>
          </div>

          <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
            Le plan Découverte est gratuit — un projet complet, sans carte bancaire.
          </p>

          {/* Aperçu du livrable */}
          <div className="card mt-16 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                Extrait d&apos;un brand book généré
              </span>
              <span className="font-logo text-lg">Maison Vermeil</span>
            </div>

            <div className="grid gap-px bg-[var(--color-line)] sm:grid-cols-3">
              <div className="bg-[#fffdfa] p-6">
                <p className="label">Palette</p>
                <div className="mt-4 flex gap-2">
                  {["#A51C30", "#161A1D", "#FFF6EC", "#C9A227", "#6B7278"].map((hex) => (
                    <div key={hex} className="flex-1">
                      <div
                        className="h-16 rounded-lg border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                      <p className="mt-2 text-[0.65rem] font-medium text-[var(--color-ink-muted)]">
                        {hex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#fffdfa] p-6">
                <p className="label">Typographies</p>
                <p className="font-logo mt-4 text-3xl leading-none">Sentient</p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Logo — 400</p>
                <p
                  className="mt-4 text-2xl font-extrabold leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Switzer
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">Titres H1 — 700</p>
                <p className="mt-4 text-lg font-medium leading-none">Satoshi</p>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  Courants, H2, H3 — 400
                </p>
              </div>

              <div className="bg-[#fffdfa] p-6">
                <p className="label">Positionnement</p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                  «&nbsp;Pour les hôtes qui reçoivent souvent et mal équipés, Maison Vermeil
                  est l&apos;art de la table qui survit au lave-vaisselle.&nbsp;»
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand)]">
                  Archétype : le Créateur
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Méthode */}
        <section id="methode" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl sm:text-4xl">La méthode</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
            Une identité ne se génère pas au hasard. Elle se déduit d&apos;une audience et
            d&apos;un marché.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-[#fffdfa] p-7">
                <p className="font-logo text-4xl text-[var(--color-brand)]">{s.step}</p>
                <h3 className="mt-4 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Livrables */}
        <section id="livrables" className="bg-[var(--color-ink)] py-20 text-[var(--color-cream)]">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl text-[var(--color-cream)] sm:text-4xl">
              Ce que vous repartez avec
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-cream)]/70">
              Un brand book complet, exploitable immédiatement par un développeur, un
              imprimeur ou une agence.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="border-t border-[var(--color-cream)]/20 pt-5">
                  <h3 className="text-lg text-[var(--color-cream)]">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream)]/65">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tarifs — aperçu */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl sm:text-4xl">Un abonnement, un nombre de projets</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
            Vous payez la capacité, pas le jeton. Chaque projet reste modifiable et
            régénérable autant de fois que nécessaire.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_ORDER.map((id) => {
              const plan = PLANS[id];
              return (
                <div
                  key={id}
                  className={`card flex flex-col p-6 ${
                    plan.highlight ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]" : ""
                  }`}
                >
                  <h3 className="text-lg">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{plan.tagline}</p>
                  <p className="mt-5 font-logo text-4xl">
                    {plan.price === 0 ? "0 €" : `${plan.price} €`}
                    <span className="text-sm font-normal text-[var(--color-ink-muted)]">
                      {" "}
                      / mois
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-brand)]">
                    {formatLimit(plan)} projet{plan.projectLimit === 1 ? "" : "s"}
                  </p>
                  <Link
                    href="/pricing"
                    className={`btn mt-6 ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                  >
                    Choisir
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="rounded-[var(--radius-xl2)] bg-[var(--color-brand)] px-8 py-16 text-center text-[var(--color-cream)]">
            <h2 className="mx-auto max-w-2xl text-3xl text-[var(--color-cream)] sm:text-4xl">
              Votre marque existe déjà. Elle attend juste d&apos;être formulée.
            </h2>
            <Link
              href="/register"
              className="btn mt-8 bg-[var(--color-cream)] px-8 py-3.5 text-base text-[var(--color-brand)] hover:bg-white"
            >
              Commencer gratuitement
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
