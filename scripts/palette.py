"""Dérive la palette complète à partir des trois couleurs imposées, contrastes vérifiés."""
import colorsys
from contrast import ratio, lum

BRAND, CREAM, INK = "#A51C30", "#FFF6EC", "#161A1D"

def to_rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
def to_hex(rgb):
    return "#" + "".join(f"{max(0,min(255,round(c*255))):02X}" for c in rgb)
def hls(h):
    r, g, b = to_rgb(h); return colorsys.rgb_to_hls(r, g, b)
def from_hls(hh, ll, ss):
    return to_hex(colorsys.hls_to_rgb(hh, max(0, min(1, ll)), max(0, min(1, ss))))

def tune(base, target_bg, target_ratio, direction, sat=None):
    """Fait varier la clarté de `base` jusqu'à atteindre le contraste voulu sur `target_bg`."""
    h, l, s = hls(base)
    if sat is not None: s = sat
    step = 0.002 * (1 if direction == "lighter" else -1)
    best = from_hls(h, l, s)
    for _ in range(500):
        if ratio(best, target_bg) >= target_ratio: break
        l += step
        best = from_hls(h, l, s)
    return best

bh, bl, bs = hls(BRAND)
ch, cl, cs = hls(CREAM)
ih, il, isat = hls(INK)

tokens = {
    # — Imposées —
    "brand":        (BRAND, "Couleur principale. Accents, boutons, liens, chiffres."),
    "cream":        (CREAM, "Couleur secondaire. Fond de toutes les pages claires."),
    "ink":          (INK,   "Couleur tertiaire. Titres et texte courant."),
}

# — Dérivées —
tokens["brand-dark"]  = (from_hls(bh, bl - 0.075, min(1, bs + 0.04)), "Survol et appui des boutons bordeaux.")
tokens["brand-light"] = (tune(BRAND, INK, 4.85, "lighter", sat=min(1, bs * 0.88)),
                         "Bordeaux lisible sur fond encre (sections sombres).")
tokens["brand-soft"]  = (from_hls(bh, 0.925, 0.48), "Fond des messages d'erreur et des états d'alerte.")
tokens["cream-deep"]  = (from_hls(ch, cl - 0.048, cs * 0.62), "Fond secondaire, jauges, aplats de repos.")
tokens["line"]        = (from_hls(ch, cl - 0.105, cs * 0.42), "Filets, bordures de cartes et de champs.")
tokens["ink-soft"]    = (from_hls(ih, il + 0.145, isat * 0.75), "Texte courant secondaire, paragraphes longs.")
tokens["ink-muted"]   = (tune(from_hls(ih, il + 0.30, isat * 0.5), CREAM, 4.5, "darker"),
                         "Légendes, métadonnées, texte tertiaire.")
tokens["surface"]     = ("#FFFDFA", "Fond des cartes, légèrement au-dessus du crème.")

print(f"{'jeton':16} {'hex':9} {'/crème':>8} {'/encre':>8}  rôle")
print("-" * 104)
for name, (hexv, role) in tokens.items():
    rc = ratio(hexv, CREAM); ri = ratio(hexv, INK)
    print(f"{name:16} {hexv:9} {rc:7.2f}:1 {ri:7.2f}:1  {role}")

print()
checks = [
    ("Encre sur crème (corps)",        INK, CREAM, 4.5),
    ("Encre atténuée sur crème",       tokens["ink-muted"][0], CREAM, 4.5),
    ("Encre douce sur crème",          tokens["ink-soft"][0], CREAM, 4.5),
    ("Bordeaux sur crème",             BRAND, CREAM, 4.5),
    ("Crème sur bordeaux (bouton)",    CREAM, BRAND, 4.5),
    ("Crème sur bordeaux foncé",       CREAM, tokens["brand-dark"][0], 4.5),
    ("Bordeaux clair sur encre",       tokens["brand-light"][0], INK, 4.5),
    ("Crème sur encre",                CREAM, INK, 4.5),
    ("Bordeaux foncé sur crème doux",  tokens["brand-dark"][0], tokens["brand-soft"][0], 4.5),
]
ok = True
print(f"{'contrôle':34} {'ratio':>8}  état")
print("-" * 60)
for name, fg, bg, need in checks:
    r = ratio(fg, bg); good = r >= need
    ok &= good
    print(f"{name:34} {r:7.2f}:1  {'OK' if good else 'ECHEC (< %.1f)' % need}")
print("\nPalette conforme AA." if ok else "\nAu moins un couple echoue.")

import json, pathlib
pathlib.Path("palette.json").write_text(
    json.dumps({k: {"hex": v[0], "role": v[1]} for k, v in tokens.items()}, ensure_ascii=False, indent=2),
    encoding="utf-8")
