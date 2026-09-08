/** Vérifie la régénération d'une seule section, y compris les sections en tableau. */
import http from "node:http";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.ANTHROPIC_API_KEY = "sk-ant-test";

const full = JSON.parse(
  readFileSync(new URL("../fixtures/identity.json", import.meta.url), "utf-8")
);
let responseBody: unknown = null;
let captured: any = null;

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    captured = JSON.parse(body);
    const text = JSON.stringify(responseBody);
    res.writeHead(200, { "Content-Type": "text/event-stream" });
    res.write(sse("message_start", { type: "message_start", message: { id: "m", type: "message", role: "assistant", model: "claude-opus-5", content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 0 } } }));
    res.write(sse("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }));
    res.write(sse("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text } }));
    res.write(sse("content_block_stop", { type: "content_block_stop", index: 0 }));
    res.write(sse("message_delta", { type: "message_delta", delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 500 } }));
    res.write(sse("message_stop", { type: "message_stop" }));
    res.end();
  });
});

await new Promise<void>((r) => server.listen(4322, r));
process.env.ANTHROPIC_BASE_URL = "http://localhost:4322";

const { refineSection } = await import("../src/lib/anthropic.ts");
const { briefSchema, identitySchema } = await import("../src/lib/brand-schema.ts");

const brief = briefSchema.parse({
  brandName: "Maison Vermeil",
  industry: "Art de la table",
  offer: "Grès émaillé fabriqué au Portugal, vendu en séries limitées.",
});
const identity = identitySchema.parse(full);

// --- Section objet : palette ---
const newPalette = {
  rationale: "Une piste plus minérale, sans terre cuite.",
  colors: [
    { name: "Ardoise", hex: "#2E3538", role: "principale", usage: "Titres", contrastNote: "11:1 sur crème" },
    { name: "Craie", hex: "#F2EFE9", role: "fond", usage: "Fond", contrastNote: "Référence" },
    { name: "Encre", hex: "#161A1D", role: "texte", usage: "Corps", contrastNote: "16:1" },
    { name: "Laiton", hex: "#B08D57", role: "accent", usage: "Détails", contrastNote: "2,8:1" },
  ],
};
responseBody = { section: newPalette };
const palette = await refineSection("palette", brief, identity, "Plus minéral.", { effort: "high" });
assert.equal(palette.colors[0].name, "Ardoise");
assert.equal(captured.output_config.format.schema.properties.section.properties.colors.type, "array");
assert.ok(captured.messages[0].content.includes("Plus minéral."), "la demande client doit être transmise");
assert.ok(captured.messages[0].content.includes("Palette de couleurs"), "la section ciblée doit être nommée");
console.log("✓ section objet régénérée (palette)");

// --- Section tableau : nextSteps (racine enveloppée) ---
responseBody = { section: ["Étape une.", "Étape deux.", "Étape trois."] };
const steps = await refineSection("nextSteps", brief, identity, "", { effort: "medium" });
assert.deepEqual(steps, ["Étape une.", "Étape deux.", "Étape trois."]);
assert.equal(captured.output_config.format.schema.properties.section.type, "array");
console.log("✓ section tableau régénérée (prochaines étapes)");

// --- Section logo : les SVG repassent par le sanitizer ---
responseBody = {
  section: {
    concept: "Monogramme géométrique.",
    construction: "Cercle de 96 unités.",
    wordmarkSvg: '<svg viewBox="0 0 200 60" onload="alert(1)"><text x="0" y="40">MV</text></svg>',
    monogramSvg: '<svg viewBox="0 0 60 60"><script>fetch("//evil")</script><circle cx="30" cy="30" r="28" fill="#2E3538"/></svg>',
    clearSpace: "Une demi-hauteur.",
    misuse: ["Ne pas incliner", "Ne pas recolorer"],
  },
};
const logo = await refineSection("logo", brief, identity, "Plus géométrique.", { effort: "xhigh" });
assert.ok(!logo.wordmarkSvg.toLowerCase().includes("onload"), "onload doit être retiré");
assert.ok(!logo.monogramSvg.includes("script"), "le <script> doit être retiré");
assert.ok(logo.monogramSvg.includes("#2E3538"), "le dessin est conservé");
assert.equal(captured.output_config.effort, "xhigh", "l'effort du plan Agence doit être transmis");
console.log("✓ section logo régénérée et assainie");

// --- L'identité recomposée reste valide ---
const merged = identitySchema.parse({ ...identity, palette: newPalette, logo });
assert.equal(merged.palette.colors.length, 4);
assert.equal(merged.summary.brandArchetype, identity.summary.brandArchetype, "le reste de l'identité est intact");
console.log("✓ identité recomposée valide et cohérente");

server.close();
console.log("\nRégénération par section validée.");
