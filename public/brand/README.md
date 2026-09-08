# Kit de marque — Brandy AI

Assets générés depuis les glyphes réels de Sentient : les logos sont des tracés
vectoriels, pas du `<text>`. Ils s'affichent donc à l'identique partout, même si
la police n'est pas chargée.

## Logos

| Fichier | Usage |
|---|---|
| `logo.svg` | **Principal.** Le nom entier en #A51C30, sur crème ou sur blanc. |
| `logo-reversed.svg` | Fond encre. Le bordeaux plein n'y tient que 2,34:1 : cette version utilise sa teinte claire (#DA5F71, 4,88:1). |
| `logo-cream.svg` | Fond bordeaux ou photo sombre. |
| `logo-ink.svg` | Une seule couleur, pour l'impression monochrome et le tampon. |
| `mark.svg` | **Monogramme minimal.** Le B seul, en bordeaux. |
| `mark-cream.svg` / `mark-ink.svg` | Le monogramme sur fond sombre / clair. |
| `mark-plate.svg` | Monogramme sur disque plein, réservé aux contextes qui imposent un fond opaque (icônes d'application). |
| `mark-192.png` / `mark-512.png` | Rasters pour manifeste PWA. |

Les icônes du site (`icon.svg`, `apple-icon.png`) et l'image sociale
(`opengraph-image.png`) vivent dans `src/app/` : Next.js les câble par
convention de fichiers, il n'y a pas de `<link>` à écrire.

### Règles

- **Zone de respiration** : la hauteur du B autour du logo, sur les quatre côtés.
- **Taille minimale** : 90 px de large pour le wordmark, 16 px pour le monogramme.
- **Ne pas** réécrire le nom avec la police système, changer la couleur hors des
  variantes ci-dessus, incliner, étirer, ni ajouter d'ombre ou de contour.

## Palette

Le contraste de chaque jeton est donné sur les deux fonds de référence. Tous les
couples texte/fond effectivement employés dans le produit passent au moins AA
(4,5:1) — la vérification est rejouable avec `scripts/palette.py`.

| Jeton | Hex | sur crème | sur encre | Rôle |
|---|---|---|---|---|
| `--color-brand` | `#A51C30` | 6.99:1 | 2.34:1 | Couleur principale. Accents, boutons, liens, chiffres. |
| `--color-cream` | `#FFF6EC` | 1.00:1 | 16.38:1 | Couleur secondaire. Fond de toutes les pages claires. |
| `--color-ink` | `#161A1D` | 16.38:1 | 1.00:1 | Couleur tertiaire. Titres et texte courant. |
| `--color-brand-dark` | `#871324` | 9.14:1 | 1.79:1 | Survol et appui des boutons bordeaux. |
| `--color-brand-light` | `#DA5F71` | 3.35:1 | 4.88:1 | Bordeaux lisible sur fond encre (sections sombres). |
| `--color-brand-soft` | `#F5E3E5` | 1.16:1 | 14.17:1 | Fond des messages d'erreur et des états d'alerte. |
| `--color-cream-deep` | `#F7EADC` | 1.11:1 | 14.80:1 | Fond secondaire, jauges, aplats de repos. |
| `--color-line` | `#EADCCB` | 1.26:1 | 13.00:1 | Filets, bordures de cartes et de champs. |
| `--color-ink-soft` | `#383F45` | 10.00:1 | 1.64:1 | Texte courant secondaire, paragraphes longs. |
| `--color-ink-muted` | `#5F676D` | 5.39:1 | 3.04:1 | Légendes, métadonnées, texte tertiaire. |
| `--color-surface` | `#FFFDFA` | 1.05:1 | 17.24:1 | Fond des cartes, légèrement au-dessus du crème. |

### Le piège à connaître

`--color-brand` (#A51C30) sur `--color-ink` (#161A1D) ne donne que **2,34:1** :
inutilisable pour du texte. Sur fond encre, prendre `--color-brand-light`
(#DA5F71, 4,88:1) ou le crème.

## Typographies

| Rôle | Police | Graisse |
|---|---|---|
| Logo | Sentient | 400 |
| H1 | Switzer | 700 |
| H2, H3, texte courant | Satoshi | 400 / 700 |

Chargées depuis Fontshare, déclarées dans `src/app/layout.tsx`.
