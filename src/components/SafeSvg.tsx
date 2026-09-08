"use client";

import { useMemo } from "react";
import { sanitizeSvg } from "@/lib/svg";

/**
 * Le SVG vient du modèle. Il est déjà assaini avant persistance, mais on
 * repasse le filtre au rendu : un projet enregistré avant un durcissement du
 * sanitizer ne doit pas devenir un vecteur d'injection.
 */
export default function SafeSvg({
  markup,
  className = "",
  fallback = "Logo indisponible",
}: {
  markup: string;
  className?: string;
  fallback?: string;
}) {
  const clean = useMemo(() => sanitizeSvg(markup), [markup]);

  if (!clean) {
    return (
      <div
        className={`flex items-center justify-center text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)] ${className}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={`[&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
