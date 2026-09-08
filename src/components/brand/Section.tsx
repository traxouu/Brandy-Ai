"use client";

import { useState } from "react";
import type { SectionKey } from "@/lib/brand-schema";

interface Props {
  id: SectionKey;
  index: number;
  title: string;
  subtitle?: string;
  onRefine: (section: SectionKey, instruction: string) => Promise<void>;
  refining: boolean;
  children: React.ReactNode;
}

export default function Section({
  id,
  index,
  title,
  subtitle,
  onRefine,
  refining,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");

  async function submit() {
    await onRefine(id, instruction);
    setInstruction("");
    setOpen(false);
  }

  return (
    <section id={id} className="rise scroll-mt-24 border-t border-[var(--color-line)] pt-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-logo text-sm text-[var(--color-brand)]">
            {String(index).padStart(2, "0")}
          </p>
          <h2 className="mt-1 text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-[var(--color-ink-soft)]">{subtitle}</p>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          disabled={refining}
          className="no-print btn btn-ghost px-4 py-2 text-xs"
        >
          {refining ? "Régénération…" : open ? "Fermer" : "Retravailler"}
        </button>
      </div>

      {open && (
        <div className="no-print mt-6 rounded-xl border border-[var(--color-line)] bg-white/70 p-5">
          <label className="label" htmlFor={`refine-${id}`}>
            Vos remarques au directeur créatif
          </label>
          <textarea
            id={`refine-${id}`}
            className="field min-h-20"
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            maxLength={600}
            placeholder="Trop attendu. Cherchez une piste plus minérale, moins chaleureuse."
          />
          <div className="mt-4 flex items-center gap-3">
            <button onClick={submit} disabled={refining} className="btn btn-primary px-5 py-2 text-sm">
              {refining ? "En cours…" : "Régénérer cette section"}
            </button>
            <span className="text-xs text-[var(--color-ink-muted)]">
              Le reste de l&apos;identité est conservé.
            </span>
          </div>
        </div>
      )}

      <div className="mt-8">{children}</div>
    </section>
  );
}
