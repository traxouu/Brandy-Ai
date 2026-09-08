import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import {
  identitySchema,
  sectionSchemas,
  type BrandIdentity,
  type Brief,
  type SectionKey,
} from "@/lib/brand-schema";
import {
  CREATIVE_DIRECTOR_SYSTEM,
  buildGenerationPrompt,
  buildRefinePrompt,
} from "@/lib/prompts";
import { sanitizeSvg } from "@/lib/svg";
import { getPlan } from "@/lib/plans";

export const MODEL = "claude-opus-5";

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "ANTHROPIC_API_KEY n'est pas configurée : le directeur créatif ne peut pas travailler."
    );
    this.name = "MissingApiKeyError";
  }
}

let client: Anthropic | null = null;

export function hasApiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

function getClient() {
  if (!hasApiKey()) throw new MissingApiKeyError();
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

/** Les abonnements élevés achètent un travail plus poussé du modèle. */
export function effortForPlan(planId: string): "medium" | "high" | "xhigh" {
  const plan = getPlan(planId);
  if (plan.id === "equipe") return "xhigh";
  if (plan.id === "studio") return "high";
  return "medium";
}

interface RunOptions {
  effort: "medium" | "high" | "xhigh";
  onProgress?: (delta: { outputTokens: number }) => void;
  signal?: AbortSignal;
}

async function runStructured<T>(
  schema: z.ZodType<T>,
  prompt: string,
  { effort, onProgress, signal }: RunOptions
): Promise<T> {
  const stream = getClient().messages.stream(
    {
      model: MODEL,
      max_tokens: 32000,
      system: [
        {
          type: "text",
          text: CREATIVE_DIRECTOR_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      thinking: { type: "adaptive" },
      output_config: {
        effort,
        format: zodOutputFormat(schema),
      },
      messages: [{ role: "user", content: prompt }],
    },
    { signal }
  );

  if (onProgress) {
    let reported = 0;
    stream.on("streamEvent", (event) => {
      if (event.type === "message_delta" && event.usage?.output_tokens) {
        const total = event.usage.output_tokens;
        if (total > reported) {
          reported = total;
          onProgress({ outputTokens: total });
        }
      } else if (event.type === "content_block_delta") {
        reported += 1;
        onProgress({ outputTokens: reported });
      }
    });
  }

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new Error(
      "Le modèle a refusé de traiter ce brief. Reformulez-le et relancez la génération."
    );
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error(
      "La réponse a été tronquée avant d'être complète. Relancez la génération."
    );
  }
  if (!message.parsed_output) {
    throw new Error("Le modèle n'a pas renvoyé une identité exploitable.");
  }

  return message.parsed_output as T;
}

/** Nettoie les SVG avant toute persistance : ils finiront injectés dans le DOM. */
function sanitizeIdentity(identity: BrandIdentity): BrandIdentity {
  return {
    ...identity,
    logo: {
      ...identity.logo,
      wordmarkSvg: sanitizeSvg(identity.logo.wordmarkSvg) ?? "",
      monogramSvg: sanitizeSvg(identity.logo.monogramSvg) ?? "",
    },
  };
}

export async function generateIdentity(
  brief: Brief,
  options: RunOptions
): Promise<BrandIdentity> {
  const identity = await runStructured(
    identitySchema,
    buildGenerationPrompt(brief),
    options
  );
  return sanitizeIdentity(identity);
}

export async function refineSection<K extends SectionKey>(
  section: K,
  brief: Brief,
  current: BrandIdentity,
  instruction: string,
  options: RunOptions
): Promise<BrandIdentity[K]> {
  // Le format de sortie structuré exige un objet racine : on enveloppe la
  // section, qui peut être un tableau (applications, nextSteps).
  const wrapped = z.object({ section: sectionSchemas[section] });
  const prompt = buildRefinePrompt(section, brief, current, instruction);

  const result = (await runStructured(wrapped, prompt, options)) as {
    section: BrandIdentity[K];
  };

  if (section === "logo") {
    const logo = result.section as BrandIdentity["logo"];
    return {
      ...logo,
      wordmarkSvg: sanitizeSvg(logo.wordmarkSvg) ?? "",
      monogramSvg: sanitizeSvg(logo.monogramSvg) ?? "",
    } as BrandIdentity[K];
  }

  return result.section;
}
