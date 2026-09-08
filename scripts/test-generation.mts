/**
 * Vérifie la chaîne de génération sans appeler l'API réelle :
 * un faux serveur Anthropic reçoit la requête, on inspecte sa forme,
 * puis on renvoie un flux SSE valide pour contrôler le parsing structuré.
 */
import http from "node:http";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.ANTHROPIC_API_KEY = "sk-ant-test";

const identity = JSON.parse(
  readFileSync(new URL("../fixtures/identity.json", import.meta.url), "utf-8")
);
let capturedRequest: any = null;

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    capturedRequest = { path: req.url, headers: req.headers, body: JSON.parse(body) };

    const text = JSON.stringify(identity);
    res.writeHead(200, { "Content-Type": "text/event-stream" });
    res.write(sse("message_start", {
      type: "message_start",
      message: {
        id: "msg_test", type: "message", role: "assistant", model: "claude-opus-5",
        content: [], stop_reason: null, stop_sequence: null,
        usage: { input_tokens: 100, output_tokens: 0 },
      },
    }));
    res.write(sse("content_block_start", {
      type: "content_block_start", index: 0,
      content_block: { type: "text", text: "" },
    }));
    // Découpé en morceaux, comme un vrai flux.
    for (let i = 0; i < text.length; i += 400) {
      res.write(sse("content_block_delta", {
        type: "content_block_delta", index: 0,
        delta: { type: "text_delta", text: text.slice(i, i + 400) },
      }));
    }
    res.write(sse("content_block_stop", { type: "content_block_stop", index: 0 }));
    res.write(sse("message_delta", {
      type: "message_delta",
      delta: { stop_reason: "end_turn", stop_sequence: null },
      usage: { output_tokens: 4200 },
    }));
    res.write(sse("message_stop", { type: "message_stop" }));
    res.end();
  });
});

await new Promise<void>((resolve) => server.listen(4321, resolve));
process.env.ANTHROPIC_BASE_URL = "http://localhost:4321";

const { generateIdentity } = await import("../src/lib/anthropic.ts");
const { briefSchema } = await import("../src/lib/brand-schema.ts");

const brief = briefSchema.parse({
  brandName: "Maison Vermeil",
  industry: "Art de la table",
  offer: "Grès émaillé fabriqué au Portugal, vendu en séries limitées.",
  priceTier: "premium",
});

let progressCalls = 0;
const result = await generateIdentity(brief, {
  effort: "high",
  onProgress: () => { progressCalls += 1; },
});

// --- Forme de la requête envoyée au modèle ---
const sent = capturedRequest.body;
assert.equal(sent.model, "claude-opus-5", "modèle attendu : claude-opus-5");
assert.equal(sent.stream, true, "la requête doit être en streaming");
assert.deepEqual(sent.thinking, { type: "adaptive" }, "réflexion adaptative attendue");
assert.equal(sent.output_config.effort, "high", "l'effort doit suivre le plan");
assert.equal(sent.output_config.format.type, "json_schema", "sortie structurée attendue");
assert.ok(sent.output_config.format.schema.properties.palette, "le schéma doit décrire la palette");
assert.equal(sent.system[0].cache_control.type, "ephemeral", "le prompt système doit être mis en cache");
assert.ok(!("budget_tokens" in (sent.thinking ?? {})), "budget_tokens est rejeté par Opus 5");
assert.ok(sent.messages[0].content.includes("Maison Vermeil"), "le brief doit être transmis");
console.log("✓ forme de la requête conforme");

// --- Résultat parsé ---
assert.equal(result.summary.brandArchetype, "Le Créateur");
assert.equal(result.palette.colors.length, 4);
assert.equal(result.audience.personas.length, 2);
console.log("✓ identité parsée par le schéma");

// --- Assainissement des logos ---
assert.ok(!result.logo.wordmarkSvg.includes("script"), "le <script> doit être retiré du wordmark");
assert.ok(result.logo.wordmarkSvg.includes("Vermeil"), "le texte du wordmark est conservé");
assert.ok(!result.logo.monogramSvg.includes("onclick"), "onclick doit être retiré du monogramme");
assert.ok(result.logo.monogramSvg.includes("#A51C30"), "les couleurs sont conservées");
console.log("✓ SVG assainis avant persistance");

assert.ok(progressCalls > 0, "la progression doit être remontée");
console.log(`✓ progression remontée (${progressCalls} événements)`);

server.close();
console.log("\nChaîne de génération validée.");
