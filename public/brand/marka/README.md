# Marka — kit de marque

Direction retenue. **Non branchée dans l'application** : le produit tourne
toujours sous Brandy AI avec la palette bordeaux.

## Le symbole

Une étoile à quatre branches balayées, vectorisée d'après le croquis :
inclinée de 25°, pointe haute vers la droite, pointe gauche vers le haut-gauche.
Flancs concaves, branches effilées, pas de trait terminal.

## Fichiers

### Noir et blanc

| Fichier | Usage |
|---|---|
| `marka-logo-noir.svg` | **Logo noir**, pour fond blanc. |
| `marka-logo-blanc.svg` | **Logo blanc**, pour fond noir. |
| `marka-logo-vertical-noir.svg` · `-blanc.svg` | Les mêmes en lockup vertical. |
| `marka-etoile-noire.svg` · `marka-etoile-blanche.svg` | Le symbole seul. |
| `marka-mot-noir.svg` · `marka-mot-blanc.svg` | Le mot seul. |
| `png/` | Les mêmes, rasterisés avec le fond intégré. |

### Couleur

| Fichier | Usage |
|---|---|
| `marka-logo.svg` | Violet, sur ivoire ou blanc. |
| `marka-logo-ivoire.svg` | Sur aplat violet. |
| `marka-logo-vertical.svg` · `-ivoire.svg` | Lockups verticaux. |
| `marka-etoile.svg` · `-ivoire.svg` · `-rouge.svg` | Le symbole seul. |
| `marka-mot.svg` | Le mot seul, Zodiak 400. |

Tout est vectorisé : le mot ne contient pas de `<text>`, il ne dépend pas de la
présence de Zodiak chez le lecteur.

### Règles

- **Zone de respiration** : la largeur de l'étoile sur les quatre côtés.
- **Taille minimale** : 16 px pour l'étoile, 20 px de haut pour le logo complet.
- **Ne pas** redresser l'inclinaison, symétriser le balayage, ni recolorer le mot
  différemment de l'étoile.

## Palette

Convertie depuis les CMYK fournis. **Sans profil ICC la conversion est
approximative** : ce sont les valeurs de la conversion naïve, celle qu'appliquent
les navigateurs. À refaire depuis les sources avant tout tirage.

| Rôle | CMYK | Hex |
|---|---|---|
| Première — principale | 42 / 84 / 0 / 40 | `#591899` |
| Seconde — fond | 0 / 5 / 11 / 7 | `#EDE1D3` |
| Troisième — accent | 0 / 76 / 74 / 10 | `#E6373C` |

| Couple | Ratio | |
|---|---|---|
| Violet sur ivoire | 8.09:1 | AAA |
| Ivoire sur violet | 8.09:1 | AAA |
| Rouge sur ivoire | 3.28:1 | AA grand seulement — jamais du texte courant |
| **Rouge sur violet** | **2.47:1** | **À proscrire** |
| Noir sur blanc | 21.00:1 | AAA |

## Typographie

Le mot est en **Zodiak 400** (Fontshare). Zodiak est très contrastée : ses
déliés s'amincissent sous 14 px, d'où la taille minimale de 20 px pour le logo
complet.

## Régénérer

```bash
pip install fonttools brotli          # zodiak-400.ttf requis (Fontshare)
python3 scripts/marka_palette.py      # CMYK -> RGB et contrôle des contrastes
python3 scripts/marka_final.py        # étoile, mot, lockups, noir et blanc
```

`scripts/star.py` et `scripts/marka_marks.py` conservent les pistes explorées :
autres réglages de l'étoile, et la famille mire / cible / cadrage écartée.
