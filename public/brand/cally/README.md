# Cally Leads — identité de marque

Identité visuelle complète. **Non branchée dans l'application** : le produit
tourne toujours sous Brandy AI avec la palette bordeaux.

## Le symbole

Une étoile à quatre branches balayées, vectorisée d'après le croquis : inclinée
de 25°, pointe haute vers la droite, pointe gauche vers le haut-gauche, flancs
concaves et branches effilées. Aucun trait terminal.

## Le logotype

Deux fontes, et c'est délibéré :

| Mot | Fonte | Graisse |
|---|---|---|
| Cally | Switzer | 500 |
| Leads | Clash Display | 600 |

Les deux sont des sans : à graisse égale les mots se confondraient et le
mélange ne se verrait pas. La graisse supérieure sur « Leads » fait ressortir
les formes propres de Clash et porte l'accent sur le mot qui compte.

**Alignement** : Clash a une capitale de 670 contre 680 pour Switzer. « Leads »
est posé à 1,015× pour que le `L` et le `C` s'alignent exactement.

Tout est vectorisé : les fichiers ne contiennent pas de `<text>`, ils ne
dépendent pas de la présence des fontes chez le lecteur.

## Fichiers

### Logotypes

| Fichier | Usage |
|---|---|
| `cally-logo.svg` | **Principal**, horizontal, violet. |
| `cally-logo-deux-lignes.svg` | Étoile à gauche, texte empilé. Le plus fort en format carré. |
| `cally-logo-vertical.svg` | Étoile au-dessus. Formats étroits. |
| `cally-mot.svg` | Le mot seul. |
| `cally-etoile.svg` | Le symbole seul. |

Chacun décliné en `-ivoire` (sur violet), `-noir` (sur blanc) et `-blanc` (sur
noir). `cally-etoile-rouge.svg` pour l'accent.

### Icônes et image sociale

| Fichier | Usage |
|---|---|
| `favicon.svg` · `avatar.svg` | Étoile ivoire sur disque violet. |
| `icone-carree.svg` | Carré plein, pour les icônes d'application. |
| `png/icone-16 … 512.png` | Rasters, manifeste PWA. |
| `png/apple-icon.png` | 180 × 180, iOS arrondit lui-même. |
| `png/opengraph.png` | 1200 × 630. **Sans accroche** — à compléter quand le positionnement sera écrit. |

### Règles

- **Zone de respiration** : la largeur de l'étoile sur les quatre côtés.
- **Taille minimale** : 14 px pour l'étoile, 12 px de haut pour le logo complet.
- **Ne pas** redresser l'inclinaison de l'étoile, symétriser son balayage,
  intervertir les fontes des deux mots, ni recolorer un mot différemment de
  l'autre.
- Sur fond sombre, l'étoile ne se met **jamais** en violet plein : passer à
  `--violet-clair` ou à l'ivoire.

## Palette

Convertie depuis les CMYK fournis. **Sans profil ICC la conversion est
approximative** : ce sont les valeurs de la conversion naïve, celle qu'appliquent
les navigateurs. À refaire depuis les sources avant tout tirage.

| Rôle | CMYK | Hex |
|---|---|---|
| Première — principale | 42 / 84 / 0 / 40 | `#591899` |
| Seconde — fond | 0 / 5 / 11 / 7 | `#EDE1D3` |
| Troisième — accent | 0 / 76 / 74 / 10 | `#E6373C` |

Les onze autres jetons en sont dérivés. Contraste donné sur l'ivoire :

| Jeton | Hex | sur ivoire | Rôle |
|---|---|---|---|
| `--violet` | `#591899` | 8.09:1 | Principale. Logo, titres, boutons, liens. |
| `--ivoire` | `#EDE1D3` | 1.00:1 | Fond de toutes les surfaces claires. |
| `--rouge` | `#E6373C` | 3.28:1 | Accent. Aplats, pastilles, graphiques — jamais du texte courant. |
| `--violet-fonce` | `#460F7B` | 10.10:1 | Survol et appui des boutons violets. |
| `--violet-clair` | `#A267DB` | 2.97:1 | Violet lisible sur fond sombre. |
| `--violet-voile` | `#EDE6F5` | 1.06:1 | Fond des surfaces sélectionnées, badges. |
| `--rouge-fonce` | `#C8191E` | 4.51:1 | Rouge utilisable en texte sur ivoire. |
| `--rouge-voile` | `#F8E2E3` | 1.04:1 | Fond des messages d'erreur. |
| `--ivoire-creuse` | `#E2D6C7` | 1.11:1 | Fond secondaire, jauges, aplats de repos. |
| `--filet` | `#D0C6BA` | 1.31:1 | Filets, bordures de cartes et de champs. |
| `--surface` | `#FFFCF8` | 1.26:1 | Fond des cartes, au-dessus de l'ivoire. |
| `--encre` | `#17131B` | 14.24:1 | Texte courant. Un noir teinté de violet, pas un gris neutre. |
| `--encre-douce` | `#423A4A` | 8.43:1 | Texte secondaire, paragraphes longs. |
| `--encre-tenue` | `#6B6076` | 4.58:1 | Légendes, métadonnées. |

### Les deux pièges

**Rouge sur violet : 2.47:1.** À proscrire, quelle que soit la taille.

**Rouge sur ivoire : 3.28:1.** Suffisant pour un aplat ou une forme graphique,
jamais pour du texte. Pour écrire en rouge, `--rouge-fonce` (4.51:1).

Tous les autres couples employés passent au moins AA.

## Typographie

| Rôle | Fonte | Graisse | Taille |
|---|---|---|---|
| Logo — « Cally » | Switzer | 500 | — |
| Logo — « Leads » | Clash Display | 600 | — |
| H1 | Clash Display | 600 | 40–96 px |
| H2, H3 | Switzer | 500 / 700 | 20–32 px |
| Texte courant | Switzer | 400 | 16–18 px |
| Légendes | Switzer | 500 | 12–14 px |

Clash Display est une fonte de titrage : elle ne descend pas sous 20 px.
Switzer porte tout le reste.

```html
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,700&f[]=clash-display@600&display=swap" rel="stylesheet">
```

## Ce qui manque

L'identité **verbale** n'est pas faite : positionnement, audience, ton de voix,
accroches. Elle demande de savoir ce que vend Cally Leads, information dont je
ne dispose pas. C'est pour ça que l'image sociale ne porte aucune accroche.

## Régénérer

```bash
pip install fonttools brotli
# switzer-500.ttf et clash-600.ttf requis (Fontshare)
python3 scripts/cally_palette.py    # CMYK -> RGB et contrôle des contrastes
python3 scripts/cally_full.py       # logos, étoile, icônes, image sociale
```
