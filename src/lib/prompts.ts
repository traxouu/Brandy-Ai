import type { Brief } from "@/lib/brand-schema";
import { SECTION_LABELS, type SectionKey } from "@/lib/brand-schema";

export const CREATIVE_DIRECTOR_SYSTEM = `Tu es le directeur artistique senior de Brandy AI, un studio de branding. Tu as vingt ans de métier : identités de marque, plateformes de marque, design systems. Tu travailles pour des fondateurs qui n'ont ni le budget ni le temps d'une agence, et tu leur livres le niveau d'exigence d'une agence.

Ta méthode :
1. Tu pars de l'audience et du marché, jamais de l'esthétique. Une couleur se justifie par une stratégie, pas par un goût personnel.
2. Tu es spécifique. Interdits : "moderne", "innovant", "dynamique", "de qualité" employés seuls. Chaque affirmation doit être défendable devant un client.
3. Tu prends parti. Une identité qui plaît à tout le monde ne signifie rien. Tu choisis un territoire et tu l'assumes.
4. Tu écris en français, ton professionnel et direct, sans jargon décoratif ni superlatifs creux.

Contraintes techniques que tu respectes toujours :
- Les couleurs sont des hexadécimaux valides au format #RRGGBB. La palette contient au minimum une couleur de fond claire, une couleur d'encre foncée lisible sur ce fond, et une couleur d'accent. Chaque couleur mentionne son ratio de contraste indicatif avec le fond ou l'encre.
- Les typographies proposées existent réellement et sont disponibles gratuitement (Google Fonts, Fontshare, ou une fonderie clairement nommée). Tu indiques la source. Tu ne proposes jamais une police que tu inventes.
- Les logos sont livrés en SVG brut, valide et autonome :
  * racine <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ..."> avec un viewBox cohérent ;
  * uniquement des éléments de dessin (path, circle, rect, ellipse, polygon, line, g, text, defs, linearGradient, stop) ;
  * aucun <script>, aucun attribut on*, aucune <image>, aucune référence externe, aucun <foreignObject> ;
  * les couleurs sont celles de la palette que tu viens de définir ;
  * si tu utilises <text>, tu déclares font-family avec la police du système typographique et un fallback générique, et tu gardes le tracé lisible même sans la police ;
  * le wordmark porte le nom complet de la marque, le monogramme porte les initiales ;
  * dessine réellement les formes : un logo composé d'un seul rectangle n'est pas une réponse acceptable.

Tu réponds exclusivement via le format structuré demandé, sans texte hors schéma.`;

function line(label: string, value: string | undefined | null) {
  const v = (value ?? "").trim();
  return v ? `- ${label} : ${v}` : null;
}

export function briefToPrompt(brief: Brief) {
  const rows = [
    line("Nom de la marque", brief.brandName),
    line("Secteur", brief.industry),
    line("Offre / produit", brief.offer),
    line("Audience visée (mots du client)", brief.audience),
    line("Mission / raison d'être", brief.mission),
    line("Concurrents cités", brief.competitors),
    line("Traits de personnalité souhaités", brief.personality.join(", ")),
    line("Ton attendu", brief.tonePreference),
    line("Intentions visuelles", brief.visualDirection),
    line("À éviter (couleurs, codes)", brief.colorsToAvoid),
    line("Marché géographique", brief.market),
    line("Positionnement tarifaire", brief.priceTier),
  ].filter(Boolean);

  return rows.join("\n");
}

export function buildGenerationPrompt(brief: Brief) {
  return `Voici le brief client. Construis l'identité de marque complète.

${briefToPrompt(brief)}

Attendus :
- Deux ou trois personas réellement distincts : s'ils partagent les mêmes objectifs, tu n'en as construit qu'un.
- Un positionnement qui tranche avec les concurrents cités, et qui explique en quoi.
- Une palette de 4 à 6 couleurs cohérente avec le positionnement tarifaire "${brief.priceTier}" et le marché "${brief.market}".
- Un système typographique de 2 à 3 polices, avec un rôle clair pour chacune (logo / titres / textes courants) et des indications de tailles.
- Deux logos SVG : un wordmark et un monogramme, dessinés avec les couleurs de ta palette.
- Des applications concrètes (site, packaging, réseaux sociaux, etc.) décrites de façon actionnable.

${
  brief.colorsToAvoid.trim()
    ? `Interdiction explicite du client : ${brief.colorsToAvoid.trim()}. Ne la contourne pas.`
    : ""
}`;
}

export function buildRefinePrompt(
  section: SectionKey,
  brief: Brief,
  currentIdentity: unknown,
  instruction: string
) {
  return `Le client veut retravailler une seule section de son identité de marque : « ${SECTION_LABELS[section]} ».

BRIEF INITIAL
${briefToPrompt(brief)}

IDENTITÉ ACTUELLE (contexte complet, à respecter pour tout ce qui n'est pas la section demandée)
${JSON.stringify(currentIdentity)}

DEMANDE DU CLIENT SUR CETTE SECTION
${instruction.trim() || "Propose une direction nettement différente, sans changer le positionnement de fond."}

Régénère uniquement la section « ${SECTION_LABELS[section]} ». Elle doit rester cohérente avec le reste de l'identité : mêmes valeurs, même archétype, même audience — sauf si la demande du client porte précisément là-dessus. Ne te contente pas de reformuler l'existant : la nouvelle version doit apporter une réponse à la demande.`;
}
