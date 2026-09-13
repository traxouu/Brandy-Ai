# Cally Leads — bannières réseaux

Aux dimensions officielles de chaque plateforme, prêtes à téléverser.

| Fichier | Dimensions | Plateforme |
|---|---|---|
| `linkedin-page-*.png` | 1128 × 191 | Couverture de page LinkedIn |
| `linkedin-profil-*.png` | 1584 × 396 | Bannière de profil LinkedIn |
| `x-header-*.png` | 1500 × 500 | En-tête X / Twitter |
| `facebook-couverture-*.png` | 820 × 312 | Couverture de page Facebook |
| `youtube-*.png` | 2560 × 1440 | Bannière de chaîne YouTube |
| `avatar-512.png` | 512 × 512 | Photo de profil, toutes plateformes |

Deux variantes par format :

- **`-violet`** — aplat violet, logo ivoire. C'est la version principale : elle
  se détache dans un fil et le contraste tient à 8,09:1.
- **`-ivoire`** — fond clair, logo violet. Pour un compte au ton plus sobre, ou
  quand la photo de profil est elle-même très colorée.

## Deux contraintes respectées dans les fichiers

**La photo de profil recouvre la bannière.** Sur LinkedIn, X et Facebook, elle
se pose en bas à gauche. Le logo est donc décalé à droite du centre sur ces
quatre formats — il n'est jamais dans la zone masquée. Ne pas le recentrer.

**YouTube n'affiche pas toute l'image.** Sur 2560 × 1440, seule la zone centrale
de 1546 × 423 est visible sur tous les appareils ; le reste est rogné selon
l'écran. Le logo est calé dans cette zone sûre.

## Ce qu'elles ne portent pas

Aucune accroche. L'identité verbale n'est pas écrite — positionnement, promesse,
ton — et une phrase inventée dans une bannière est une promesse que le produit
n'a pas faite. À ajouter quand le brief produit existera.

## Régénérer

```bash
python3 scripts/cally_banners.py   # écrit les pages, puis rendu navigateur
```

Le rendu passe par un bloc de taille fixe posé dans une fenêtre plus grande,
puis un découpage aux pixels exacts : Chromium impose une hauteur de fenêtre
minimale et rognerait les formats courts comme le 1128 × 191.
