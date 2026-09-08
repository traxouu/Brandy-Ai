# Essai — Marka AI en Zodiak

Piste **non adoptée** : le produit s'appelle toujours Brandy AI et son logo reste
en Sentient. Ces fichiers existent pour arbitrer, pas pour être servis.

| Fichier | Fond |
|---|---|
| `marka-logo.svg` | Crème ou blanc — #A51C30 |
| `marka-logo-reversed.svg` | Encre — #DA5F71, le bordeaux plein n'y tient que 2,34:1 |
| `marka-logo-cream.svg` | Aplat bordeaux |
| `marka-logo-ink.svg` | Monochrome, impression une couleur |
| `marka-mark.svg` / `marka-mark-cream.svg` | Monogramme M |

Vectorisés depuis Zodiak 400 (Fontshare), même méthode que le kit principal :
`scripts/build_assets.py`, en substituant la police et la chaîne.

Pour basculer : pointer `--font-logo` sur `--font-zodiak` dans `globals.css`,
remplacer le tracé de `src/components/Logo.tsx`, et reprendre le nom partout
(métadonnées, README, image sociale, textes de la landing).
