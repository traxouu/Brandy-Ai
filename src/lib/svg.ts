/**
 * Assainissement des SVG produits par le modèle.
 *
 * Le logo est du markup généré : il est injecté dans le DOM, donc traité comme
 * une entrée hostile. On repart d'une liste blanche (balises + attributs) et on
 * jette tout le reste, plutôt que de chasser les motifs dangereux un par un.
 */

const ALLOWED_TAGS = new Set([
  "svg",
  "g",
  "defs",
  "title",
  "desc",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "lineargradient",
  "radialgradient",
  "stop",
  "clippath",
  "mask",
  "use",
  "symbol",
  "marker",
]);

/** Balises dont le contenu entier est supprimé, pas seulement la balise. */
const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "foreignobject",
  "image",
  "a",
  "animate",
  "animatetransform",
  "animatemotion",
  "set",
  "iframe",
  "object",
  "embed",
  "handler",
  "audio",
  "video",
]);

const ALLOWED_ATTRS = new Set([
  "viewbox",
  "xmlns",
  "width",
  "height",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "d",
  "points",
  "transform",
  "gradienttransform",
  "gradientunits",
  "spreadmethod",
  "offset",
  "stop-color",
  "stop-opacity",
  "fill",
  "fill-opacity",
  "fill-rule",
  "clip-rule",
  "clip-path",
  "mask",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "stroke-miterlimit",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "word-spacing",
  "text-anchor",
  "dominant-baseline",
  "alignment-baseline",
  "baseline-shift",
  "dx",
  "dy",
  "id",
  "class",
  "preserveaspectratio",
  "vector-effect",
  "paint-order",
  "shape-rendering",
  "overflow",
  "maskunits",
  "clippathunits",
  "markerwidth",
  "markerheight",
  "refx",
  "refy",
  "orient",
]);

/** Attributs pouvant porter une référence : seules les ancres locales passent. */
const REFERENCE_ATTRS = new Set(["fill", "stroke", "clip-path", "mask", "filter"]);

/** Les noms de balises SVG camelCase doivent retrouver leur graphie exacte. */
const CANONICAL_TAGS: Record<string, string> = {
  lineargradient: "linearGradient",
  radialgradient: "radialGradient",
  clippath: "clipPath",
};

function canonicalTag(name: string) {
  return CANONICAL_TAGS[name] ?? name;
}

interface Tag {
  raw: string;
  name: string;
  closing: boolean;
  selfClosing: boolean;
  attrs: Array<[string, string]>;
}

function parseTag(raw: string): Tag | null {
  const inner = raw.slice(1, raw.endsWith("/>") ? -2 : -1);
  const closing = inner.startsWith("/");
  const body = closing ? inner.slice(1) : inner;
  const match = /^\s*([A-Za-z_][\w:.-]*)/.exec(body);
  if (!match) return null;

  const name = match[1].toLowerCase();
  const attrs: Array<[string, string]> = [];
  const attrRe = /([A-Za-z_:][-\w:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'<>`]+))/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(body.slice(match[0].length))) !== null) {
    attrs.push([m[1].toLowerCase(), m[3] ?? m[4] ?? m[5] ?? ""]);
  }

  return { raw, name, closing, selfClosing: raw.endsWith("/>"), attrs };
}

function isSafeValue(attr: string, value: string) {
  const v = value.trim();
  const lower = v.toLowerCase();

  if (lower.includes("javascript:") || lower.includes("data:text/html")) return false;
  if (/&#(x0*6a|0*106)/i.test(lower)) return false; // "j" encodé, préfixe de javascript:

  if (lower.includes("url(")) {
    // Une url() n'est tolérée que si elle pointe vers une ancre locale (#id).
    if (!REFERENCE_ATTRS.has(attr)) return false;
    const refs = lower.match(/url\(([^)]*)\)/g) ?? [];
    for (const ref of refs) {
      const target = ref.slice(4, -1).replace(/['"]/g, "").trim();
      if (!target.startsWith("#")) return false;
    }
  }

  return true;
}

/** Découpe le document en séquence de balises et de texte, en respectant les guillemets. */
function tokenize(input: string): Array<{ type: "tag" | "text"; value: string }> {
  const tokens: Array<{ type: "tag" | "text"; value: string }> = [];
  let i = 0;
  let text = "";

  while (i < input.length) {
    const ch = input[i];
    if (ch !== "<") {
      text += ch;
      i += 1;
      continue;
    }

    // Commentaires, CDATA, doctype et instructions de traitement : supprimés.
    if (input.startsWith("<!--", i)) {
      const end = input.indexOf("-->", i);
      i = end === -1 ? input.length : end + 3;
      continue;
    }
    if (input.startsWith("<![CDATA[", i)) {
      const end = input.indexOf("]]>", i);
      i = end === -1 ? input.length : end + 3;
      continue;
    }
    if (input.startsWith("<!", i) || input.startsWith("<?", i)) {
      const end = input.indexOf(">", i);
      i = end === -1 ? input.length : end + 1;
      continue;
    }

    // Balise ordinaire : on avance jusqu'au ">" hors guillemets.
    let j = i + 1;
    let quote: string | null = null;
    while (j < input.length) {
      const c = input[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === ">") {
        break;
      }
      j += 1;
    }
    if (j >= input.length) {
      text += input.slice(i);
      break;
    }

    if (text) {
      tokens.push({ type: "text", value: text });
      text = "";
    }
    tokens.push({ type: "tag", value: input.slice(i, j + 1) });
    i = j + 1;
  }

  if (text) tokens.push({ type: "text", value: text });
  return tokens;
}

function escapeText(value: string) {
  return value.replace(/&(?![a-zA-Z#][a-zA-Z0-9]{0,8};)/g, "&amp;").replace(/</g, "&lt;");
}

export function sanitizeSvg(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;

  // Le modèle encadre parfois le SVG d'une clôture markdown.
  let source = input.trim().replace(/^```(?:svg|xml|html)?\s*/i, "").replace(/```$/i, "").trim();

  const start = source.toLowerCase().indexOf("<svg");
  if (start === -1) return null;
  source = source.slice(start);

  const out: string[] = [];
  const openStack: string[] = [];
  let skipDepth = 0;
  let skippedTag: string | null = null;
  let sawSvgRoot = false;
  let rootHasViewBox = false;

  for (const token of tokenize(source)) {
    if (token.type === "text") {
      if (skipDepth === 0) out.push(escapeText(token.value));
      continue;
    }

    const tag = parseTag(token.value);
    if (!tag) continue;

    if (skipDepth > 0) {
      if (tag.name === skippedTag) {
        if (tag.closing) skipDepth -= 1;
        else if (!tag.selfClosing) skipDepth += 1;
        if (skipDepth === 0) skippedTag = null;
      }
      continue;
    }

    if (DROP_WITH_CONTENT.has(tag.name)) {
      if (!tag.closing && !tag.selfClosing) {
        skipDepth = 1;
        skippedTag = tag.name;
      }
      continue;
    }

    if (!ALLOWED_TAGS.has(tag.name)) continue;

    if (tag.closing) {
      const idx = openStack.lastIndexOf(tag.name);
      if (idx === -1) continue;
      // Referme proprement tout ce qui reste ouvert au-dessus.
      while (openStack.length > idx) {
        out.push(`</${canonicalTag(openStack.pop() as string)}>`);
      }
      continue;
    }

    const attrs: string[] = [];
    for (const [name, value] of tag.attrs) {
      if (name.startsWith("on") || name.startsWith("xlink:") || name === "href") continue;
      if (name === "xmlns" && tag.name !== "svg") continue;
      if (!ALLOWED_ATTRS.has(name)) continue;
      if (!isSafeValue(name, value)) continue;
      if (tag.name === "svg" && name === "viewbox") rootHasViewBox = true;
      const attrName = name === "viewbox" ? "viewBox" : normalizeAttrName(name);
      attrs.push(`${attrName}="${value.replace(/"/g, "&quot;").replace(/</g, "&lt;")}"`);
    }

    if (tag.name === "svg") {
      if (sawSvgRoot) continue; // un seul <svg> racine
      sawSvgRoot = true;
      if (!attrs.some((a) => a.startsWith("xmlns="))) {
        attrs.unshift('xmlns="http://www.w3.org/2000/svg"');
      }
      if (!rootHasViewBox) attrs.push('viewBox="0 0 300 100"');
    }

    const open = `<${canonicalTag(tag.name)}${attrs.length ? " " + attrs.join(" ") : ""}`;
    if (tag.selfClosing) {
      out.push(`${open} />`);
    } else {
      out.push(`${open}>`);
      openStack.push(tag.name);
    }
  }

  while (openStack.length) out.push(`</${canonicalTag(openStack.pop() as string)}>`);

  const result = out.join("").trim();
  if (!sawSvgRoot || !result.toLowerCase().startsWith("<svg")) return null;
  return result;
}

/** Les attributs SVG sensibles à la casse doivent retrouver leur graphie exacte. */
const CASE_SENSITIVE_ATTRS: Record<string, string> = {
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  gradientunits: "gradientUnits",
  gradienttransform: "gradientTransform",
  spreadmethod: "spreadMethod",
  clippathunits: "clipPathUnits",
  maskunits: "maskUnits",
  markerwidth: "markerWidth",
  markerheight: "markerHeight",
  refx: "refX",
  refy: "refY",
};

function normalizeAttrName(name: string) {
  return CASE_SENSITIVE_ATTRS[name] ?? name;
}
