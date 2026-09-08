"use client";

import { useState } from "react";
import type { BrandIdentity, Brief } from "@/lib/brand-schema";
import {
  buildCssTokens,
  buildJsonExport,
  downloadFile,
  exportFilename,
} from "@/lib/export";
import { sanitizeSvg } from "@/lib/svg";

export default function ExportMenu({
  brief,
  identity,
}: {
  brief: Brief;
  identity: BrandIdentity;
}) {
  const [open, setOpen] = useState(false);

  const actions: Array<{ label: string; run: () => void }> = [
    {
      label: "Brand book (JSON)",
      run: () =>
        downloadFile(
          exportFilename(brief.brandName, "brandbook.json"),
          buildJsonExport(brief, identity),
          "application/json"
        ),
    },
    {
      label: "Design tokens (CSS)",
      run: () =>
        downloadFile(
          exportFilename(brief.brandName, "tokens.css"),
          buildCssTokens(brief, identity),
          "text/css"
        ),
    },
    {
      label: "Logo principal (SVG)",
      run: () => {
        const svg = sanitizeSvg(identity.logo.wordmarkSvg);
        if (svg) {
          downloadFile(
            exportFilename(brief.brandName, "wordmark.svg"),
            svg,
            "image/svg+xml"
          );
        }
      },
    },
    {
      label: "Monogramme (SVG)",
      run: () => {
        const svg = sanitizeSvg(identity.logo.monogramSvg);
        if (svg) {
          downloadFile(
            exportFilename(brief.brandName, "monogram.svg"),
            svg,
            "image/svg+xml"
          );
        }
      },
    },
    { label: "Imprimer / PDF", run: () => window.print() },
  ];

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="btn btn-ink px-5 py-2.5 text-sm">
        Exporter
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu d'export"
          />
          <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-lg">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  action.run();
                  setOpen(false);
                }}
                className="block w-full px-5 py-3 text-left text-sm hover:bg-[var(--color-cream-deep)]"
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
