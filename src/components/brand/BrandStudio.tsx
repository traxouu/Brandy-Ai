"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BrandIdentity, SectionKey } from "@/lib/brand-schema";
import { identitySchema, SECTION_LABELS } from "@/lib/brand-schema";
import type { ParsedProject } from "@/lib/project";
import BrandBook from "@/components/brand/BrandBook";
import ExportMenu from "@/components/brand/ExportMenu";
import GenerationProgress from "@/components/brand/GenerationProgress";

interface Props {
  project: ParsedProject;
  autostart: boolean;
  apiKeyConfigured: boolean;
}

export default function BrandStudio({ project, autostart, apiKeyConfigured }: Props) {
  const router = useRouter();
  const [identity, setIdentity] = useState<BrandIdentity | null>(project.identity);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState<string | null>(project.error);
  const [refiningSection, setRefiningSection] = useState<SectionKey | null>(null);
  const started = useRef(false);

  const generate = useCallback(async () => {
    if (started.current) return;
    started.current = true;

    setGenerating(true);
    setError(null);
    setProgress(0);
    setPhase("Analyse du brief…");

    try {
      const response = await fetch(`/api/projects/${project.id}/generate`, {
        method: "POST",
      });

      if (!response.ok || !response.body) {
        const message = await response.text().catch(() => "");
        setError(message || "La génération n'a pas pu démarrer.");
        setGenerating(false);
        started.current = false;
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const eventLine = frame.split("\n").find((l) => l.startsWith("event: "));
          const dataLine = frame.split("\n").find((l) => l.startsWith("data: "));
          if (!eventLine || !dataLine) continue;

          const name = eventLine.slice(7).trim();
          let payload: Record<string, unknown> = {};
          try {
            payload = JSON.parse(dataLine.slice(6));
          } catch {
            continue;
          }

          if (name === "status") {
            setPhase(String(payload.message ?? ""));
          } else if (name === "progress") {
            setProgress(Number(payload.outputTokens ?? 0));
            setPhase("Rédaction de la plateforme de marque…");
          } else if (name === "done") {
            const parsed = identitySchema.safeParse(payload.identity);
            if (parsed.success) {
              setIdentity(parsed.data);
              setPhase("");
            } else {
              setError("L'identité reçue est incomplète. Relancez la génération.");
            }
          } else if (name === "error") {
            setError(String(payload.message ?? "Erreur pendant la génération."));
          }
        }
      }
    } catch {
      setError("La connexion au serveur a été interrompue.");
    } finally {
      setGenerating(false);
      started.current = false;
      router.refresh();
    }
  }, [project.id, router]);

  useEffect(() => {
    if (autostart && !project.identity && apiKeyConfigured) {
      void generate();
    }
    // Un seul démarrage automatique, à l'arrivée depuis le formulaire de brief.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refine = useCallback(
    async (section: SectionKey, instruction: string) => {
      setRefiningSection(section);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${project.id}/refine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, instruction }),
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(body.error ?? "La régénération a échoué.");
          return;
        }

        const parsed = identitySchema.safeParse(body.identity);
        if (parsed.success) {
          setIdentity(parsed.data);
          router.refresh();
        } else {
          setError("La section régénérée est inexploitable. Réessayez.");
        }
      } catch {
        setError("Impossible de joindre le serveur.");
      } finally {
        setRefiningSection(null);
      }
    },
    [project.id, router]
  );

  return (
    <>
      <div className="no-print flex flex-wrap items-start justify-between gap-6">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--color-encre-tenue)] hover:text-[var(--color-violet)]"
          >
            ← Tous les projets
          </Link>
          <h1 className="font-display-face mt-3 text-[clamp(2.4rem,6vw,4rem)] leading-none">
            {project.brief.brandName}
          </h1>
          <p className="mt-3 text-[var(--color-encre-douce)]">
            {project.brief.industry} · {project.brief.market} ·{" "}
            {project.brief.priceTier}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {identity && <ExportMenu brief={project.brief} identity={identity} />}
          <button
            onClick={generate}
            disabled={generating || !apiKeyConfigured}
            className="btn btn-primary px-5 py-2.5 text-sm"
          >
            {generating
              ? "Génération…"
              : identity
                ? "Tout régénérer"
                : "Lancer la génération"}
          </button>
        </div>
      </div>

      {!apiKeyConfigured && (
        <p className="no-print mt-8 rounded-xl border border-[var(--color-violet)]/30 bg-[var(--color-violet-voile)] px-5 py-4 text-sm text-[var(--color-violet-fonce)]">
          <strong className="font-bold">ANTHROPIC_API_KEY absente :</strong> le
          directeur créatif ne peut pas travailler tant que la clé n&apos;est pas
          définie côté serveur.
        </p>
      )}

      {error && (
        <p className="no-print mt-8 rounded-xl border border-[var(--color-violet)]/30 bg-[var(--color-violet-voile)] px-5 py-4 text-sm text-[var(--color-violet-fonce)]">
          {error}
        </p>
      )}

      {generating && <GenerationProgress phase={phase} progress={progress} />}

      {identity ? (
        <div className="mt-14">
          <nav className="no-print mb-12 flex flex-wrap gap-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="rounded-full border border-[var(--color-filet)] bg-white/60 px-4 py-1.5 text-xs font-medium text-[var(--color-encre-douce)] hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]"
              >
                {SECTION_LABELS[key]}
              </a>
            ))}
          </nav>

          <BrandBook
            identity={identity}
            onRefine={refine}
            refiningSection={refiningSection}
          />
        </div>
      ) : (
        !generating && (
          <div className="card mt-14 px-8 py-20 text-center">
            <h2 className="text-2xl">Le brief est prêt. L&apos;identité, pas encore.</h2>
            <p className="mx-auto mt-3 max-w-md text-[var(--color-encre-douce)]">
              Lancez la génération : le directeur créatif construit l&apos;audience, le
              positionnement, la palette, les typographies et les logos en une passe.
            </p>
            <button
              onClick={generate}
              disabled={!apiKeyConfigured}
              className="btn btn-primary mt-8 px-7 py-3"
            >
              Lancer la génération
            </button>
          </div>
        )
      )}
    </>
  );
}
