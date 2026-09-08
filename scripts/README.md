# Scripts

| Script | Rôle |
|---|---|
| `test-svg.mts` | 16 cas d'injection contre le sanitizer SVG. |
| `test-generation.mts` | Chaîne de génération, contre un serveur Anthropic simulé. |
| `test-refine.mts` | Régénération par section, même dispositif. |
| `palette.py` | Dérive la palette depuis les trois couleurs imposées et vérifie chaque contraste. |
| `contrast.py` | Ratios WCAG, utilisé par `palette.py`. |
| `outline.py` | Convertit du texte en tracés SVG à partir d'un TTF. |
| `build_assets.py` | Génère les logos depuis Sentient. |

Les trois derniers ne servent qu'à **régénérer** le kit de marque ; les assets
produits sont versionnés dans `public/brand/`, il n'y a rien à exécuter pour
lancer le site.

```bash
pip install fonttools brotli
# Sentient 400 doit être présent sous le nom sentient-400.ttf (Fontshare)
python3 palette.py && python3 build_assets.py
```
