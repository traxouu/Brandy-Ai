import type { BrandIdentity, Brief } from "@/lib/brand-schema";

function slug(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "marque"
  );
}

export function tokenName(value: string) {
  return slug(value);
}

/** Design tokens CSS, directement collables dans un projet front. */
export function buildCssTokens(brief: Brief, identity: BrandIdentity) {
  const colors = identity.palette.colors
    .map((color) => `  --color-${slug(color.name)}: ${color.hex.toLowerCase()}; /* ${color.role} */`)
    .join("\n");

  const fonts = identity.typography.pairing
    .map(
      (font) =>
        `  --font-${slug(font.role)}: "${font.family}", ${font.fallback}; /* ${font.weights.join(", ")} */`
    )
    .join("\n");

  return `/* ${brief.brandName} — design tokens
 * Généré par Brandy AI
 * Archétype : ${identity.summary.brandArchetype}
 */
:root {
${colors}

${fonts}
}
`;
}

export function buildJsonExport(brief: Brief, identity: BrandIdentity) {
  return JSON.stringify(
    {
      generator: "Brandy AI",
      generatedAt: new Date().toISOString(),
      brief,
      identity,
    },
    null,
    2
  );
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportFilename(brandName: string, suffix: string) {
  return `${slug(brandName)}-${suffix}`;
}
