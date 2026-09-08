# Brandy AI

Un SaaS qui vend du branding : l'utilisateur décrit sa marque, un directeur créatif
propulsé par Claude construit l'identité complète — audience, positionnement, logo
vectoriel, palette de couleurs, typographies, ton de voix. L'abonnement ouvre un
nombre de projets.

## Ce que le produit livre

Pour chaque projet, un brand book en dix sections, toutes régénérables
individuellement avec les remarques du client :

| # | Section | Contenu |
|---|---|---|
| 01 | Direction créative | Phrase-résumé, archétype de marque et sa justification |
| 02 | Audience | Segments principal et secondaire, 2-3 personas (objectifs, frustrations, déclencheurs, canaux) |
| 03 | Positionnement | Phrase de positionnement, proposition de valeur, accroches, différenciateurs, preuves |
| 04 | Ton de voix | Attributs, règles à suivre et à éviter, exemples de titre et de paragraphe |
| 05 | Palette | 4 à 6 couleurs avec rôle, usage et note de contraste |
| 06 | Typographies | 2 à 3 polices réellement existantes, hiérarchie, tailles, fallbacks, source |
| 07 | Logo | Wordmark et monogramme en SVG, construction, zone de respiration, usages interdits |
| 08 | Moodboard | Mots-clés, direction photographique, matières, références |
| 09 | Applications | Site, packaging, réseaux sociaux… déclinés concrètement |
| 10 | Prochaines étapes | Ce qu'il reste à faire, dans l'ordre |

Exports : brand book JSON, design tokens CSS, logos SVG, impression / PDF.

## Abonnements

| Plan | Prix | Projets | Effort du modèle |
|---|---|---|---|
| Découverte | 0 € | 1 | medium |
| Starter | 19 €/mois | 3 | medium |
| Studio | 49 €/mois | 10 | high |
| Agence | 149 €/mois | illimités | xhigh |

Le quota est appliqué côté serveur à la création de projet. Sans clés Stripe, l'app
tourne en **mode démo** : les changements de plan s'appliquent immédiatement, sans
paiement.

## Démarrage

```bash
npm install
cp .env.example .env      # puis renseignez AUTH_SECRET et ANTHROPIC_API_KEY
npm run db:push
npm run dev
```

### Variables d'environnement

| Variable | Requis | Rôle |
|---|---|---|
| `DATABASE_URL` | oui | SQLite en local (`file:./dev.db`), Postgres en production |
| `AUTH_SECRET` | oui | Signature des sessions JWT — 32 caractères aléatoires (`openssl rand -base64 32`) |
| `ANTHROPIC_API_KEY` | oui | Le directeur créatif. Sans elle l'app démarre, mais la génération renvoie 503 |
| `NEXT_PUBLIC_APP_URL` | oui | URL publique, utilisée pour les redirections Stripe |
| `STRIPE_SECRET_KEY` | non | Active la facturation réelle ; absente, l'app passe en mode démo |
| `STRIPE_WEBHOOK_SECRET` | non | Vérification de signature du webhook |
| `STRIPE_PRICE_STARTER` / `_STUDIO` / `_AGENCY` | non | Identifiants de tarif Stripe par plan |

### Stripe

Le webhook écoute `checkout.session.completed`, `customer.subscription.created`,
`customer.subscription.updated` et `customer.subscription.deleted` sur
`/api/webhooks/stripe`. En local :

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Architecture

```
src/
  app/
    page.tsx                       Landing
    pricing/                       Tarifs et souscription
    login/  register/              Authentification
    dashboard/                     Projets, brief, brand book, abonnement
    api/
      auth/                        Inscription, connexion, déconnexion
      projects/                    CRUD projets, quota par plan
      projects/[id]/generate       Génération en streaming (SSE)
      projects/[id]/refine         Régénération d'une section
      billing/  webhooks/stripe    Abonnements
  lib/
    anthropic.ts                   Client Claude, sorties structurées, effort par plan
    brand-schema.ts                Contrat Zod de l'identité de marque
    prompts.ts                     Le prompt système du directeur créatif
    svg.ts                         Assainissement des SVG générés
    plans.ts  session.ts  auth.ts  stripe.ts  export.ts  db.ts  project.ts
```

### Le modèle

`claude-opus-5`, en streaming, avec réflexion adaptative et **sorties structurées**
(`output_config.format` alimenté par le schéma Zod de `brand-schema.ts`). Le schéma
est le contrat : une identité qui ne le respecte pas n'est jamais persistée. Le
niveau d'effort suit le plan de l'utilisateur.

Le prompt système impose au modèle de partir de l'audience plutôt que de
l'esthétique, de proscrire les adjectifs creux, de ne proposer que des polices
réellement existantes, et de livrer des SVG autonomes sans script ni référence
externe.

### Sécurité

- **SVG générés** — le logo est du markup produit par un modèle et injecté dans le
  DOM. `lib/svg.ts` le reconstruit à partir d'une liste blanche de balises et
  d'attributs : scripts, gestionnaires d'événements, `foreignObject`, `<image>`,
  `javascript:` et les `url()` non locales sont supprimés. Le filtre s'applique
  deux fois — avant persistance et au rendu — pour qu'une entrée en base
  antérieure à un durcissement du filtre reste inoffensive.
- **Sessions** — JWT HS256 dans un cookie `httpOnly`, `sameSite=lax`, `secure` en
  production.
- **Mots de passe** — bcrypt, coût 10. La connexion renvoie le même message que le
  compte existe ou non.
- **Isolation** — chaque requête projet est filtrée par `userId` ; un projet
  appartenant à un autre compte renvoie 404, jamais 403.
- **Webhook Stripe** — signature vérifiée sur le corps brut.

## Tests

```bash
npm test          # typecheck + sanitizer SVG + chaîne IA
npm run test:svg  # 16 cas d'injection contre le sanitizer
npm run test:ai   # génération et régénération contre un serveur Anthropic simulé
```

`test:ai` monte un faux serveur Anthropic : il vérifie la forme exacte de la requête
envoyée (modèle, réflexion adaptative, schéma de sortie, mise en cache du prompt
système, effort), le parsing de la réponse et l'assainissement des SVG — sans
consommer de crédits.

## Design system

| Rôle | Valeur |
|---|---|
| Couleur principale | `#A51C30` |
| Couleur secondaire | `#FFF6EC` |
| Couleur tertiaire | `#161A1D` |
| Logo | Sentient, serif |
| H1 | Switzer, sans-serif |
| P, H2, H3 | Satoshi, sans-serif |

Les polices viennent de Fontshare ; les tokens sont déclarés dans
`src/app/globals.css` sous `@theme` (Tailwind v4).
