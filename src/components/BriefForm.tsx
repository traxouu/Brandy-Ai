"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PERSONALITY_TRAITS = [
  "Chaleureux",
  "Rigoureux",
  "Audacieux",
  "Confidentiel",
  "Artisanal",
  "Technique",
  "Ludique",
  "Intransigeant",
  "Élégant",
  "Direct",
  "Militant",
  "Rassurant",
];

const PRICE_TIERS = ["accessible", "milieu de gamme", "premium", "luxe"] as const;

export default function BriefForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traits, setTraits] = useState<string[]>([]);

  function toggleTrait(trait: string) {
    setTraits((current) =>
      current.includes(trait)
        ? current.filter((t) => t !== trait)
        : current.length >= 6
          ? current
          : [...current, trait]
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(event.currentTarget);
    const payload = {
      brandName: String(data.get("brandName") ?? "").trim(),
      industry: String(data.get("industry") ?? "").trim(),
      offer: String(data.get("offer") ?? "").trim(),
      audience: String(data.get("audience") ?? "").trim(),
      mission: String(data.get("mission") ?? "").trim(),
      competitors: String(data.get("competitors") ?? "").trim(),
      tonePreference: String(data.get("tonePreference") ?? "").trim(),
      visualDirection: String(data.get("visualDirection") ?? "").trim(),
      colorsToAvoid: String(data.get("colorsToAvoid") ?? "").trim(),
      market: String(data.get("market") ?? "France").trim(),
      priceTier: String(data.get("priceTier") ?? "milieu de gamme"),
      personality: traits,
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(body.error ?? "Impossible de créer le projet.");
        setPending(false);
        return;
      }

      router.push(`/dashboard/projects/${body.id}?autostart=1`);
    } catch {
      setError("Impossible de joindre le serveur.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="card p-7">
        <h2 className="text-xl">L&apos;essentiel</h2>
        <p className="mt-1 mb-6 text-sm text-[var(--color-encre-tenue)]">
          Ces trois champs suffisent à lancer une direction. Les suivants la rendent
          plus juste.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="brandName">
              Nom de la marque *
            </label>
            <input
              id="brandName"
              name="brandName"
              className="field"
              placeholder="Maison Vermeil"
              maxLength={80}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="industry">
              Secteur d&apos;activité *
            </label>
            <input
              id="industry"
              name="industry"
              className="field"
              placeholder="Art de la table, vente en ligne"
              maxLength={120}
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="offer">
            Que vendez-vous, concrètement ? *
          </label>
          <textarea
            id="offer"
            name="offer"
            className="field min-h-28"
            placeholder="Des assiettes et couverts en grès émaillé, fabriqués au Portugal, vendus en série limitée sur notre site. Panier moyen 180 €."
            minLength={20}
            maxLength={1200}
            required
          />
          <p className="mt-1.5 text-xs text-[var(--color-encre-tenue)]">
            Plus vous êtes précis sur le produit et le prix, plus la direction est juste.
          </p>
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-xl">Le marché</h2>
        <p className="mt-1 mb-6 text-sm text-[var(--color-encre-tenue)]">
          Le directeur créatif part de là pour construire le positionnement.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="market">
              Marché géographique
            </label>
            <input
              id="market"
              name="market"
              className="field"
              defaultValue="France"
              maxLength={120}
            />
          </div>

          <div>
            <label className="label" htmlFor="priceTier">
              Positionnement tarifaire
            </label>
            <select id="priceTier" name="priceTier" className="field" defaultValue="milieu de gamme">
              {PRICE_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="audience">
            À qui vous adressez-vous ?
          </label>
          <textarea
            id="audience"
            name="audience"
            className="field min-h-20"
            placeholder="Trentenaires urbains qui viennent d'emménager, reçoivent souvent, et en ont assez de la vaisselle jetable."
            maxLength={800}
          />
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="competitors">
            Vos concurrents
          </label>
          <input
            id="competitors"
            name="competitors"
            className="field"
            placeholder="Sessùn Maison, Jars Céramistes, Made.com"
            maxLength={600}
          />
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="mission">
            Votre raison d&apos;être
          </label>
          <textarea
            id="mission"
            name="mission"
            className="field min-h-20"
            placeholder="Remettre de la matière et du geste dans un quotidien devenu jetable."
            maxLength={800}
          />
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-xl">Le caractère</h2>
        <p className="mt-1 mb-6 text-sm text-[var(--color-encre-tenue)]">
          Six traits maximum. Choisir, c&apos;est renoncer — c&apos;est ce qui donne une
          identité tranchée.
        </p>

        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAITS.map((trait) => {
            const active = traits.includes(trait);
            return (
              <button
                key={trait}
                type="button"
                onClick={() => toggleTrait(trait)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[var(--color-violet)] bg-[var(--color-violet)] text-[var(--color-ivoire)]"
                    : "border-[var(--color-filet)] bg-white/60 text-[var(--color-encre-douce)] hover:border-[var(--color-violet)]"
                }`}
              >
                {trait}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--color-encre-tenue)]">
          {traits.length}/6 sélectionnés
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="tonePreference">
              Ton attendu
            </label>
            <input
              id="tonePreference"
              name="tonePreference"
              className="field"
              placeholder="Sobre, jamais donneur de leçons"
              maxLength={300}
            />
          </div>

          <div>
            <label className="label" htmlFor="colorsToAvoid">
              À éviter absolument
            </label>
            <input
              id="colorsToAvoid"
              name="colorsToAvoid"
              className="field"
              placeholder="Le vert sauge, les codes « scandinave »"
              maxLength={300}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="visualDirection">
            Intentions visuelles
          </label>
          <textarea
            id="visualDirection"
            name="visualDirection"
            className="field min-h-20"
            placeholder="Matière, terre cuite, lumière rasante. Rien de clinique."
            maxLength={600}
          />
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-[var(--color-violet)]/30 bg-[var(--color-violet-voile)] px-5 py-4 text-sm text-[var(--color-violet-fonce)]">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary px-7 py-3.5 text-base" disabled={pending}>
          {pending ? "Création du projet…" : "Lancer la direction créative"}
        </button>
        <Link href="/dashboard" className="text-sm text-[var(--color-encre-tenue)] hover:text-[var(--color-violet)]">
          Annuler
        </Link>
      </div>
    </form>
  );
}
