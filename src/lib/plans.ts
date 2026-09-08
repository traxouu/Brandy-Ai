export type PlanId = "free" | "starter" | "studio" | "agency";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // en euros / mois
  projectLimit: number; // -1 = illimité
  tagline: string;
  features: string[];
  priceEnvKey?: string;
  highlight?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Découverte",
    price: 0,
    projectLimit: 1,
    tagline: "Un projet pour juger sur pièce.",
    features: [
      "1 projet de marque",
      "Audience, positionnement, palette, typographies",
      "Logo vectoriel généré (SVG)",
      "Export JSON du brand book",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 19,
    projectLimit: 3,
    tagline: "Pour lancer sa première marque proprement.",
    features: [
      "3 projets de marque",
      "Brand book complet et imprimable",
      "Régénération illimitée de chaque section",
      "Ton de voix et messages clés",
      "Support par email",
    ],
    priceEnvKey: "STRIPE_PRICE_STARTER",
  },
  studio: {
    id: "studio",
    name: "Studio",
    price: 49,
    projectLimit: 10,
    tagline: "Le rythme d'un studio indépendant.",
    features: [
      "10 projets de marque",
      "Tout le plan Starter",
      "Variantes de logo (monogramme, pictogramme)",
      "Personas détaillés et cartographie concurrentielle",
      "Export SVG + CSS design tokens",
    ],
    priceEnvKey: "STRIPE_PRICE_STUDIO",
    highlight: true,
  },
  agency: {
    id: "agency",
    name: "Agence",
    price: 149,
    projectLimit: -1,
    tagline: "Pour les agences qui livrent en série.",
    features: [
      "Projets illimités",
      "Tout le plan Studio",
      "Direction artistique en profondeur (effort max)",
      "Priorité de génération",
      "Accompagnement dédié",
    ],
    priceEnvKey: "STRIPE_PRICE_AGENCY",
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "starter", "studio", "agency"];

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}

export function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}

export function planAllowsMoreProjects(planId: string, currentCount: number) {
  const plan = getPlan(planId);
  return plan.projectLimit === -1 || currentCount < plan.projectLimit;
}

export function formatLimit(plan: Plan) {
  return plan.projectLimit === -1 ? "illimités" : String(plan.projectLimit);
}
