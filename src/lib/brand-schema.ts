import { z } from "zod";

/**
 * Le contrat que le directeur créatif doit remplir.
 * Ce schéma sert à la fois de format de sortie structuré pour le modèle
 * et de garde-fou côté serveur avant persistance.
 */

const hex = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale attendue au format #RRGGBB");

export const briefSchema = z.object({
  brandName: z.string().trim().min(1, "Le nom de la marque est requis.").max(80),
  industry: z.string().trim().min(2, "Précisez le secteur d'activité.").max(120),
  offer: z
    .string()
    .trim()
    .min(20, "Décrivez l'offre en une vingtaine de caractères au minimum.")
    .max(1200),
  audience: z.string().trim().max(800).default(""),
  mission: z.string().trim().max(800).default(""),
  competitors: z.string().trim().max(600).default(""),
  personality: z.array(z.string().trim().min(1)).max(8).default([]),
  tonePreference: z.string().trim().max(300).default(""),
  visualDirection: z.string().trim().max(600).default(""),
  colorsToAvoid: z.string().trim().max(300).default(""),
  market: z.string().trim().max(120).default("France"),
  priceTier: z
    .enum(["accessible", "milieu de gamme", "premium", "luxe"])
    .default("milieu de gamme"),
});

export type Brief = z.infer<typeof briefSchema>;

const personaSchema = z.object({
  name: z.string(),
  archetypeLabel: z.string(),
  age: z.string(),
  situation: z.string(),
  goals: z.array(z.string()).min(2).max(5),
  frustrations: z.array(z.string()).min(2).max(5),
  triggers: z.array(z.string()).min(1).max(4),
  channels: z.array(z.string()).min(2).max(6),
  quote: z.string(),
});

const colorSchema = z.object({
  name: z.string(),
  hex,
  role: z.string(),
  usage: z.string(),
  contrastNote: z.string(),
});

const fontSchema = z.object({
  role: z.string(),
  family: z.string(),
  fallback: z.string(),
  weights: z.array(z.string()).min(1).max(5),
  sizeGuidance: z.string(),
  rationale: z.string(),
  source: z.string(),
});

export const identitySchema = z.object({
  summary: z.object({
    oneLiner: z.string(),
    creativeDirection: z.string(),
    brandArchetype: z.string(),
    archetypeRationale: z.string(),
  }),
  audience: z.object({
    coreSegment: z.string(),
    secondarySegment: z.string(),
    insight: z.string(),
    personas: z.array(personaSchema).min(2).max(3),
  }),
  positioning: z.object({
    statement: z.string(),
    valueProposition: z.string(),
    taglines: z.array(z.string()).min(3).max(5),
    differentiators: z.array(z.string()).min(3).max(5),
    competitiveAngle: z.string(),
    proofPoints: z.array(z.string()).min(2).max(5),
  }),
  voice: z.object({
    toneAttributes: z.array(z.string()).min(3).max(5),
    description: z.string(),
    dos: z.array(z.string()).min(3).max(5),
    donts: z.array(z.string()).min(3).max(5),
    sampleHeadline: z.string(),
    sampleBodyCopy: z.string(),
  }),
  palette: z.object({
    rationale: z.string(),
    colors: z.array(colorSchema).min(4).max(6),
  }),
  typography: z.object({
    rationale: z.string(),
    pairing: z.array(fontSchema).min(2).max(3),
  }),
  logo: z.object({
    concept: z.string(),
    construction: z.string(),
    wordmarkSvg: z.string(),
    monogramSvg: z.string(),
    clearSpace: z.string(),
    misuse: z.array(z.string()).min(2).max(4),
  }),
  moodboard: z.object({
    keywords: z.array(z.string()).min(5).max(10),
    imageryDirection: z.string(),
    textureAndMaterials: z.string(),
    references: z.array(z.string()).min(2).max(4),
  }),
  applications: z.array(
    z.object({
      surface: z.string(),
      direction: z.string(),
    })
  ).min(3).max(5),
  nextSteps: z.array(z.string()).min(3).max(5),
});

export type BrandIdentity = z.infer<typeof identitySchema>;

export const SECTION_KEYS = [
  "summary",
  "audience",
  "positioning",
  "voice",
  "palette",
  "typography",
  "logo",
  "moodboard",
  "applications",
  "nextSteps",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Direction créative",
  audience: "Audience",
  positioning: "Positionnement",
  voice: "Ton de voix",
  palette: "Palette de couleurs",
  typography: "Typographies",
  logo: "Logo",
  moodboard: "Moodboard",
  applications: "Applications",
  nextSteps: "Prochaines étapes",
};

/** Schémas partiels, utilisés pour régénérer une seule section. */
export const sectionSchemas = {
  summary: identitySchema.shape.summary,
  audience: identitySchema.shape.audience,
  positioning: identitySchema.shape.positioning,
  voice: identitySchema.shape.voice,
  palette: identitySchema.shape.palette,
  typography: identitySchema.shape.typography,
  logo: identitySchema.shape.logo,
  moodboard: identitySchema.shape.moodboard,
  applications: identitySchema.shape.applications,
  nextSteps: identitySchema.shape.nextSteps,
} as const;
