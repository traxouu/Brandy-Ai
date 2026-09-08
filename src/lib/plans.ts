export type PlanId = "solo" | "studio" | "equipe";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // en euros / mois
  leadLimit: number; // leads qualifiés inclus par mois, -1 = illimité
  tagline: string;
  features: string[];
  priceEnvKey: string;
  highlight?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  solo: {
    id: "solo",
    name: "Solo",
    price: 39,
    leadLimit: 150,
    tagline: "Pour un indépendant qui répond seul.",
    features: [
      "150 leads qualifiés par mois",
      "Formulaire et widget à poser sur votre site",
      "Score de qualification sur chaque lead",
      "Notification par email",
    ],
    priceEnvKey: "STRIPE_PRICE_SOLO",
  },
  studio: {
    id: "studio",
    name: "Studio",
    price: 99,
    leadLimit: 600,
    tagline: "Le rythme d'une petite équipe commerciale.",
    features: [
      "600 leads qualifiés par mois",
      "Tout le plan Solo",
      "Règles de qualification sur mesure",
      "Attribution automatique par commercial",
      "Export CSV et connexion à votre CRM",
    ],
    priceEnvKey: "STRIPE_PRICE_STUDIO",
    highlight: true,
  },
  equipe: {
    id: "equipe",
    name: "Équipe",
    price: 249,
    leadLimit: -1,
    tagline: "Pour les équipes qui traitent au volume.",
    features: [
      "Leads illimités",
      "Tout le plan Studio",
      "Plusieurs sources et plusieurs sites",
      "Rapports d'équipe et suivi du taux de transformation",
      "Accompagnement dédié",
    ],
    priceEnvKey: "STRIPE_PRICE_EQUIPE",
  },
};

export const PLAN_ORDER: PlanId[] = ["solo", "studio", "equipe"];

/** Le plan par défaut d'un compte sans abonnement actif. */
export const DEFAULT_PLAN: PlanId = "solo";

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS[DEFAULT_PLAN];
}

export function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}

export function planAllowsMore(planId: string, currentCount: number) {
  const plan = getPlan(planId);
  return plan.leadLimit === -1 || currentCount < plan.leadLimit;
}

export function formatLimit(plan: Plan) {
  return plan.leadLimit === -1 ? "illimités" : plan.leadLimit.toLocaleString("fr-FR");
}

/** Le quota en toutes lettres — « illimités » ne peut pas précéder le nom. */
export function formatQuota(plan: Plan) {
  return plan.leadLimit === -1
    ? "Leads qualifiés illimités"
    : `${plan.leadLimit.toLocaleString("fr-FR")} leads qualifiés / mois`;
}
