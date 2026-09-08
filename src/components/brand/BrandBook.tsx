"use client";

import type { BrandIdentity, SectionKey } from "@/lib/brand-schema";
import { SECTION_LABELS } from "@/lib/brand-schema";
import Section from "@/components/brand/Section";
import { List, Tag } from "@/components/brand/Tag";
import SafeSvg from "@/components/SafeSvg";

interface Props {
  identity: BrandIdentity;
  onRefine: (section: SectionKey, instruction: string) => Promise<void>;
  refiningSection: SectionKey | null;
}

/** Noir ou blanc : la couleur de texte qui reste lisible sur un fond donné. */
function readableInk(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  return luminance > 0.42 ? "#161A1D" : "#FFF6EC";
}

export default function BrandBook({ identity, onRefine, refiningSection }: Props) {
  const props = (id: SectionKey, index: number) => ({
    id,
    index,
    title: SECTION_LABELS[id],
    onRefine,
    refining: refiningSection === id,
  });

  return (
    <div className="space-y-14">
      {/* 01 — Direction créative */}
      <Section {...props("summary", 1)} subtitle={identity.summary.oneLiner}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <p className="text-lg leading-relaxed text-[var(--color-encre-douce)]">
            {identity.summary.creativeDirection}
          </p>
          <div className="card p-6">
            <p className="label">Archétype de marque</p>
            <p className="font-display-face mt-2 text-3xl text-[var(--color-violet)]">
              {identity.summary.brandArchetype}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-encre-douce)]">
              {identity.summary.archetypeRationale}
            </p>
          </div>
        </div>
      </Section>

      {/* 02 — Audience */}
      <Section {...props("audience", 2)} subtitle={identity.audience.insight}>
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <p className="label">Cible principale</p>
            <p className="mt-2 leading-relaxed text-[var(--color-encre-douce)]">
              {identity.audience.coreSegment}
            </p>
          </div>
          <div className="card p-6">
            <p className="label">Cible secondaire</p>
            <p className="mt-2 leading-relaxed text-[var(--color-encre-douce)]">
              {identity.audience.secondarySegment}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {identity.audience.personas.map((persona) => (
            <article key={persona.name} className="card p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display-face text-2xl">{persona.name}</h3>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-violet)]">
                  {persona.archetypeLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-encre-tenue)]">
                {persona.age} · {persona.situation}
              </p>

              <blockquote className="mt-5 border-l-2 border-[var(--color-violet)] pl-4 font-display-face text-lg italic leading-snug">
                « {persona.quote} »
              </blockquote>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="label">Objectifs</p>
                  <List items={persona.goals} tone="positive" />
                </div>
                <div>
                  <p className="label">Frustrations</p>
                  <List items={persona.frustrations} tone="negative" />
                </div>
                <div>
                  <p className="label">Déclencheurs</p>
                  <List items={persona.triggers} />
                </div>
                <div>
                  <p className="label">Où les atteindre</p>
                  <div className="flex flex-wrap gap-2">
                    {persona.channels.map((channel) => (
                      <Tag key={channel}>{channel}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 03 — Positionnement */}
      <Section {...props("positioning", 3)}>
        <div className="rounded-[var(--radius-xl2)] bg-[var(--color-encre)] p-8 text-[var(--color-ivoire)] sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ivoire)]/50">
            Phrase de positionnement
          </p>
          <p className="font-display-face mt-4 text-[clamp(1.4rem,3vw,2.2rem)] leading-snug">
            « {identity.positioning.statement} »
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="label">Proposition de valeur</p>
            <p className="leading-relaxed text-[var(--color-encre-douce)]">
              {identity.positioning.valueProposition}
            </p>

            <p className="label mt-8">Angle concurrentiel</p>
            <p className="leading-relaxed text-[var(--color-encre-douce)]">
              {identity.positioning.competitiveAngle}
            </p>
          </div>

          <div>
            <p className="label">Différenciateurs</p>
            <List items={identity.positioning.differentiators} tone="positive" />

            <p className="label mt-8">Preuves</p>
            <List items={identity.positioning.proofPoints} />
          </div>
        </div>

        <div className="mt-10">
          <p className="label">Accroches candidates</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {identity.positioning.taglines.map((tagline, i) => (
              <div key={i} className="card px-5 py-4">
                <p className="font-display-face text-lg leading-snug">{tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 04 — Ton de voix */}
      <Section {...props("voice", 4)} subtitle={identity.voice.description}>
        <div className="mb-8 flex flex-wrap gap-2">
          {identity.voice.toneAttributes.map((attr) => (
            <span
              key={attr}
              className="rounded-full bg-[var(--color-violet)] px-4 py-1.5 text-sm font-bold text-[var(--color-ivoire)]"
            >
              {attr}
            </span>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <p className="label">À faire</p>
            <List items={identity.voice.dos} tone="positive" />
          </div>
          <div className="card p-6">
            <p className="label">À éviter</p>
            <List items={identity.voice.donts} tone="negative" />
          </div>
        </div>

        <div className="mt-8 card p-8">
          <p className="label">Exemple de copie</p>
          <h3
            className="mt-2 text-[clamp(1.5rem,3.5vw,2.4rem)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {identity.voice.sampleHeadline}
          </h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-encre-douce)]">
            {identity.voice.sampleBodyCopy}
          </p>
        </div>
      </Section>

      {/* 05 — Palette */}
      <Section {...props("palette", 5)} subtitle={identity.palette.rationale}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {identity.palette.colors.map((color) => (
            <div key={color.hex + color.name} className="card overflow-hidden">
              <div
                className="flex h-36 items-end p-5"
                style={{ backgroundColor: color.hex, color: readableInk(color.hex) }}
              >
                <span className="font-mono text-sm font-bold">{color.hex.toUpperCase()}</span>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display-face text-xl">{color.name}</h3>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--color-violet)]">
                    {color.role}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-encre-douce)]">
                  {color.usage}
                </p>
                <p className="mt-3 text-xs text-[var(--color-encre-tenue)]">
                  {color.contrastNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 06 — Typographies */}
      <Section {...props("typography", 6)} subtitle={identity.typography.rationale}>
        <div className="space-y-5">
          {identity.typography.pairing.map((font) => (
            <div key={font.role + font.family} className="card p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="label mb-1">{font.role}</p>
                  <h3 className="text-2xl">{font.family}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {font.weights.map((weight) => (
                    <Tag key={weight}>{weight}</Tag>
                  ))}
                </div>
              </div>

              <p
                className="mt-6 truncate text-[clamp(2rem,6vw,3.5rem)] leading-none"
                style={{ fontFamily: `"${font.family}", ${font.fallback}` }}
              >
                Aa Bb Cc — 0123
              </p>

              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="label">Tailles</p>
                  <p className="text-[var(--color-encre-douce)]">{font.sizeGuidance}</p>
                </div>
                <div>
                  <p className="label">Fallback</p>
                  <p className="font-mono text-xs text-[var(--color-encre-douce)]">
                    {font.fallback}
                  </p>
                </div>
                <div>
                  <p className="label">Source</p>
                  <p className="text-[var(--color-encre-douce)]">{font.source}</p>
                </div>
              </div>

              <p className="mt-5 border-t border-[var(--color-filet)] pt-4 text-sm leading-relaxed text-[var(--color-encre-douce)]">
                {font.rationale}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 07 — Logo */}
      <Section {...props("logo", 7)} subtitle={identity.logo.concept}>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card flex min-h-64 items-center justify-center bg-white p-10">
            <SafeSvg markup={identity.logo.wordmarkSvg} className="max-h-40 w-full max-w-lg" fallback="Wordmark indisponible" />
          </div>
          <div className="card flex min-h-64 items-center justify-center bg-[var(--color-encre)] p-10">
            <SafeSvg markup={identity.logo.monogramSvg} className="max-h-32 w-32" fallback="Monogramme indisponible" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div>
            <p className="label">Construction</p>
            <p className="text-sm leading-relaxed text-[var(--color-encre-douce)]">
              {identity.logo.construction}
            </p>
          </div>
          <div>
            <p className="label">Zone de respiration</p>
            <p className="text-sm leading-relaxed text-[var(--color-encre-douce)]">
              {identity.logo.clearSpace}
            </p>
          </div>
          <div>
            <p className="label">Usages interdits</p>
            <List items={identity.logo.misuse} tone="negative" />
          </div>
        </div>
      </Section>

      {/* 08 — Moodboard */}
      <Section {...props("moodboard", 8)}>
        <div className="mb-8 flex flex-wrap gap-2">
          {identity.moodboard.keywords.map((keyword) => (
            <span
              key={keyword}
              className="font-display-face rounded-full border border-[var(--color-filet)] bg-white/70 px-5 py-2 text-lg"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="label">Direction photographique</p>
            <p className="text-sm leading-relaxed text-[var(--color-encre-douce)]">
              {identity.moodboard.imageryDirection}
            </p>
          </div>
          <div>
            <p className="label">Matières et textures</p>
            <p className="text-sm leading-relaxed text-[var(--color-encre-douce)]">
              {identity.moodboard.textureAndMaterials}
            </p>
          </div>
          <div>
            <p className="label">Références</p>
            <List items={identity.moodboard.references} />
          </div>
        </div>
      </Section>

      {/* 09 — Applications */}
      <Section {...props("applications", 9)}>
        <div className="grid gap-5 sm:grid-cols-2">
          {identity.applications.map((application) => (
            <div key={application.surface} className="card p-6">
              <h3 className="text-lg">{application.surface}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-encre-douce)]">
                {application.direction}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 10 — Prochaines étapes */}
      <Section {...props("nextSteps", 10)}>
        <ol className="space-y-4">
          {identity.nextSteps.map((step, i) => (
            <li key={i} className="flex gap-5">
              <span className="font-display-face text-2xl text-[var(--color-violet)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1.5 leading-relaxed text-[var(--color-encre-douce)]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
