"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Lecture du brief et du marché",
  "Cadrage de l'audience",
  "Choix du territoire de marque",
  "Construction de la palette",
  "Système typographique",
  "Tracé des logos",
  "Mise au propre du brand book",
];

export default function GenerationProgress({
  phase,
  progress,
}: {
  phase: string;
  progress: number;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Progression indicative : le modèle ne rapporte pas d'avancement sémantique.
  const stepIndex = Math.min(
    STEPS.length - 1,
    Math.floor((progress / 900) * STEPS.length)
  );

  return (
    <div className="no-print card mt-10 overflow-hidden">
      <div className="border-b border-[var(--color-filet)] px-7 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl">Le directeur créatif travaille.</h2>
          <span className="font-mono text-sm text-[var(--color-encre-tenue)]">
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--color-encre-douce)]">
          {phase || "Réflexion en cours…"} Une identité complète demande en général
          une à trois minutes.
        </p>
      </div>

      <ol className="divide-y divide-[var(--color-filet)]">
        {STEPS.map((step, i) => {
          const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "todo";
          return (
            <li key={step} className="flex items-center gap-4 px-7 py-3.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                  state === "done"
                    ? "bg-[var(--color-encre)] text-[var(--color-ivoire)]"
                    : state === "active"
                      ? "animate-pulse bg-[var(--color-violet)] text-[var(--color-ivoire)]"
                      : "border border-[var(--color-filet)] text-[var(--color-encre-tenue)]"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span
                className={`text-sm ${
                  state === "todo"
                    ? "text-[var(--color-encre-tenue)]"
                    : "font-medium text-[var(--color-encre)]"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
