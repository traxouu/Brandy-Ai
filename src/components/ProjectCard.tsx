"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ParsedProject } from "@/lib/project";

const STATUS_LABEL: Record<string, string> = {
  draft: "Brief prêt",
  generating: "Génération en cours",
  ready: "Identité livrée",
  error: "Échec de génération",
};

export default function ProjectCard({ project }: { project: ParsedProject }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const colors = project.identity?.palette.colors.slice(0, 5) ?? [];

  async function remove() {
    setDeleting(true);
    const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    } else {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
        <div className="flex h-24 items-stretch bg-[var(--color-ivoire-creuse)]">
          {colors.length > 0 ? (
            colors.map((color) => (
              <div
                key={color.hex + color.name}
                className="flex-1"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} · ${color.hex}`}
              />
            ))
          ) : (
            <div className="flex w-full items-center justify-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-encre-tenue)]">
              Palette à générer
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display-face text-xl leading-tight">{project.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${
                project.status === "ready"
                  ? "bg-[var(--color-encre)] text-[var(--color-ivoire)]"
                  : project.status === "error"
                    ? "bg-[var(--color-violet)] text-[var(--color-ivoire)]"
                    : "bg-[var(--color-ivoire-creuse)] text-[var(--color-encre-tenue)]"
              }`}
            >
              {STATUS_LABEL[project.status] ?? project.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-[var(--color-encre-tenue)]">
            {project.brief.industry}
          </p>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-encre-douce)]">
            {project.identity?.summary.oneLiner ?? project.brief.offer}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-[var(--color-filet)] px-5 py-3">
        <span className="text-xs text-[var(--color-encre-tenue)]">
          {new Date(project.updatedAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        {confirming ? (
          <span className="flex items-center gap-3 text-xs">
            <button
              onClick={remove}
              disabled={deleting}
              className="font-bold text-[var(--color-violet)]"
            >
              {deleting ? "Suppression…" : "Confirmer"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-[var(--color-encre-tenue)]"
            >
              Annuler
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-[var(--color-encre-tenue)] hover:text-[var(--color-violet)]"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
