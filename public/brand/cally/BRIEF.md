# Cally Leads — charte à transmettre

Document autoportant : tout ce qu'il faut pour produire du travail conforme à
l'identité, sans autre contexte.

---

## 1. Palette

Trois couleurs imposées, onze dérivées. Ne jamais en inventer d'autres.

| Jeton | Hex | Emploi |
|---|---|---|
| `violet` | `#591899` | **Principale.** Structure : titres, badges, chiffres, bordures actives, aplats. |
| `ivoire` | `#EDE1D3` | **Fond** de toutes les pages. |
| `rouge` | `#E6373C` | **Action.** Uniquement les appels à l'action et les mots mis en force. |
| `violet-fonce` | `#460F7B` | Survol des surfaces violettes. |
| `violet-clair` | `#A267DB` | Violet lisible sur fond sombre. |
| `violet-voile` | `#EDE6F5` | Badges, surfaces sélectionnées. |
| `rouge-fonce` | `#C8191E` | Survol des boutons rouges. |
| `rouge-voile` | `#F8E2E3` | Fond des messages d'erreur. |
| `ivoire-creuse` | `#E2D6C7` | Fond secondaire, bandes, jauges. |
| `filet` | `#D0C6BA` | Filets, bordures de cartes et de champs. |
| `surface` | `#FFFCF8` | Fond des cartes, au-dessus de l'ivoire. |
| `encre` | `#17131B` | Texte courant. Un noir teinté de violet, jamais un gris neutre. |
| `encre-douce` | `#423A4A` | Texte secondaire, paragraphes longs. |
| `encre-tenue` | `#6B6076` | Légendes, métadonnées. |

### Règle du rouge

Le rouge ne sert qu'à **deux choses** : les appels à l'action, et un mot mis en
force dans un grand titre. Partout ailleurs, c'est le violet.

`#E6373C` a une luminance de 0,199 — pile au milieu de l'échelle. Son plafond
absolu est de 4,98:1 avec du noir pur et 4,22:1 avec du blanc pur. **Aucun petit
texte ne peut donc vivre dessus.** D'où :

- Bouton rouge → texte **blanc pur** (4,22:1), jamais ivoire (3,28:1).
- Survol du bouton → `rouge-fonce`.
- Mot en force → uniquement au-delà de 24 px (3,28:1 sur ivoire suffit en grand
  corps, pas en petit).

### Couples interdits

| Couple | Ratio | |
|---|---|---|
| rouge sur violet | 2,47:1 | **Jamais**, quelle que soit la taille. |
| rouge sur ivoire-creuse | 2,95:1 | **Jamais**, même en grand corps. |

Sur un aplat violet, un bouton s'inverse : fond ivoire, texte violet.

### Couples vérifiés

encre/ivoire 14,24:1 · encre-douce/ivoire 8,43:1 · encre-tenue/ivoire 4,58:1 ·
violet/ivoire 8,09:1 · ivoire/violet 8,09:1 · rouge-fonce/ivoire 4,51:1.
Tous ≥ AA.

---

## 2. Typographie

Deux fontes, chargées depuis Fontshare :

```html
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=clash-display@500,600&display=swap" rel="stylesheet">
```

| Rôle | Fonte | Graisse | Taille |
|---|---|---|---|
| H1 | Clash Display | 600 | 40–96 px |
| H2, H3 | Switzer | 700 | 20–32 px |
| Texte courant | Switzer | 400 | 16–18 px |
| Légendes, libellés | Switzer | 500 | 12–14 px |

**Clash Display est une fonte de titrage : elle ne descend jamais sous 20 px.**
Switzer porte tout le reste.

Libellés en capitales : `font-weight: 700`, `letter-spacing: 0.06em`,
`text-transform: uppercase`, couleur `encre-tenue`.

---

## 3. Logo

**Le symbole** — une étoile à quatre branches balayées, inclinée de 25° : la
pointe haute part vers la droite, la pointe gauche vers le haut-gauche. Flancs
concaves, branches effilées, aucun trait terminal. L'asymétrie est voulue.

**Le logotype** — « Cally » en Switzer 500, « Leads » en Clash Display 600.
Les deux sont des sans : à graisse égale les mots se confondraient. La graisse
supérieure sur « Leads » fait ressortir les formes de Clash et porte l'accent
sur le mot qui compte. Clash a une capitale de 670 contre 680 pour Switzer :
« Leads » est posé à **1,015×** pour que le `L` et le `C` s'alignent.

**Trois lockups** : horizontal (usage courant), deux lignes (formats carrés et
avatars), vertical (formats étroits).

### Règles

- **Respiration** : la largeur de l'étoile sur les quatre côtés.
- **Tailles minimales** : 14 px pour l'étoile seule, 12 px de haut pour le logo
  complet.
- **Dans une barre de navigation** : le symbole seul, à gauche, sans lien de
  menu. L'appel à l'action est à droite.
- **Interdits** : redresser l'inclinaison, symétriser le balayage, intervertir
  les fontes des deux mots, recolorer un mot différemment de l'autre, poser
  l'étoile en violet plein sur un fond sombre (passer au violet clair ou à
  l'ivoire).

---

## 4. Composants

| Élément | Spécification |
|---|---|
| Bouton principal | Fond `rouge`, texte `#FFFFFF`, rayon 999 px, `font-weight: 700`, `0.7rem 1.4rem`. Survol `rouge-fonce`. |
| Bouton sur aplat violet | Fond `ivoire`, texte `violet`. Survol blanc. |
| Bouton secondaire | Bordure 1 px `encre`, texte `encre`, fond transparent. Survol : fond `encre`, texte `ivoire`. |
| Carte | Fond `surface`, bordure 1 px `filet`, rayon 1,25 rem. |
| Champ | Fond `surface`, bordure 1 px `filet`, rayon 0,75 rem. Focus : bordure `violet` + halo `rgba(89,24,153,0.16)` sur 3 px. |
| Filet | 1 px `filet`. |

**Sobriété des contenants** : bordure, fond, rayon et ombre disent « objet
distinct ». Les dépenser par rôle, pas les empiler sur chaque bloc.

---

## 5. Structure d'une page

Barre de navigation collante : symbole seul à gauche, appel à l'action à droite,
fond `ivoire` à 85 % avec flou, filet en bas. Un second appel à l'action en fin
de page, sur un aplat violet, bouton inversé.

Largeur maximale 1152 px, marge latérale 24 px. Espacement par `gap` en flex ou
grid, jamais par marges individuelles. Texte courant autour de 65 caractères.

Toute numérotation (01 / 02 / 03) doit correspondre à une vraie séquence. Sinon,
pas de numéros.

---

## 6. Ce qui n'existe pas encore

L'identité **verbale** n'est pas écrite : positionnement, audience, ton de voix,
accroches. Ne pas l'inventer — demander le brief produit.
