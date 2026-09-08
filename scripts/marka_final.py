"""Kit Marka — étoile à quatre branches balayées, sans traits terminaux.
Inclinée de 25° : pointe haute vers la droite, pointe gauche vers le haut-gauche."""
import math, json, pathlib, sys
sys.path.insert(0, ".")
from outline import text_to_path

P = {k: v["hex"] for k, v in json.loads(pathlib.Path("marka_palette.json").read_text(encoding="utf-8")).items()}
OUT = pathlib.Path("kit_final"); OUT.mkdir(exist_ok=True)
ZODIAK = "zodiak-400.ttf"

R, RIN, SWEEP, BEND, SHARP, TILT = 46.0, 9.0, 22.0, 0.42, 0.58, 25.0

def pol(r, a, cx=50.0, cy=50.0):
    t = math.radians(a - 90)
    return cx + r * math.cos(t), cy + r * math.sin(t)

def star_path():
    step, d = 90.0, []
    for i in range(4):
        a = TILT + i * step
        v0, v1 = pol(RIN, a - step / 2 + SWEEP), pol(RIN, a + step / 2 + SWEEP)
        tip = pol(R, a)
        c0 = pol(R * BEND, a - step / 2 * (1 - SHARP) + SWEEP * 0.5)
        c1 = pol(R * BEND, a + step / 2 * (1 - SHARP) + SWEEP * 0.5)
        if i == 0:
            d.append("M%.2f %.2f" % v0)
        d.append("Q%.2f %.2f %.2f %.2f" % (c0 + tip))
        d.append("Q%.2f %.2f %.2f %.2f" % (c1 + v1))
    return "".join(d) + "Z"

STAR = star_path()

def symbol(color):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" '
            'aria-label="Marka"><path d="%s" fill="%s"/></svg>' % (STAR, color))

def word(color, size=100, tracking=0.012):
    g = text_to_path(ZODIAK, "Marka", size=size, tracking=tracking, origin=(0, 0))
    x0, y0, x1, y1 = g["bounds"]
    pad = size * 0.05
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.2f %.2f %.2f %.2f" role="img" '
            'aria-label="Marka"><path d="%s" fill="%s"/></svg>'
            % (x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad, g["d"], color)), g

def lockup(color, stacked=False, size=100, tracking=0.012):
    g = text_to_path(ZODIAK, "Marka", size=size, tracking=tracking, origin=(0, 0))
    x0, y0, x1, y1 = g["bounds"]
    ww, wh = x1 - x0, y1 - y0
    cap = 70.0 * size / 100.0

    if not stacked:
        sym, gap = cap * 1.62, cap * 0.30
        sy = -cap / 2 - sym / 2
        body = ('<g transform="translate(0 %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
                '<g transform="translate(%.2f 0)"><path d="%s" fill="%s"/></g>'
                % (sy, sym / 100, STAR, color, sym + gap - x0, g["d"], color))
        vy = min(sy, y0)
        vb = (0.0, vy, sym + gap + ww, max(sy + sym, y1) - vy)
    else:
        sym, gap = cap * 1.95, cap * 0.34
        body = ('<g transform="translate(%.2f %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
                '<g transform="translate(%.2f 0)"><path d="%s" fill="%s"/></g>'
                % ((ww - sym) / 2, y0 - gap - sym, sym / 100, STAR, color, -x0, g["d"], color))
        vb = (0.0, y0 - gap - sym, ww, gap + sym + wh)

    pad = size * 0.05
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.2f %.2f %.2f %.2f" role="img" '
            'aria-label="Marka">%s</svg>'
            % (vb[0] - pad, vb[1] - pad, vb[2] + 2 * pad, vb[3] + 2 * pad, body))

VIOLET, IVOIRE, ROUGE, NOIR, BLANC = P["violet"], P["ivoire"], P["rouge"], "#000000", "#FFFFFF"
assets = {
    "marka-logo.svg":                 lockup(VIOLET),
    "marka-logo-ivoire.svg":          lockup(IVOIRE),
    "marka-logo-vertical.svg":        lockup(VIOLET, stacked=True),
    "marka-logo-vertical-ivoire.svg": lockup(IVOIRE, stacked=True),
    "marka-etoile.svg":               symbol(VIOLET),
    "marka-etoile-ivoire.svg":        symbol(IVOIRE),
    "marka-etoile-rouge.svg":         symbol(ROUGE),
    "marka-mot.svg":                  word(VIOLET)[0],
    # Noir et blanc
    "marka-logo-noir.svg":            lockup(NOIR),
    "marka-logo-blanc.svg":           lockup(BLANC),
    "marka-logo-vertical-noir.svg":   lockup(NOIR, stacked=True),
    "marka-logo-vertical-blanc.svg":  lockup(BLANC, stacked=True),
    "marka-etoile-noire.svg":         symbol(NOIR),
    "marka-etoile-blanche.svg":       symbol(BLANC),
    "marka-mot-noir.svg":             word(NOIR)[0],
    "marka-mot-blanc.svg":            word(BLANC)[0],
}
for n, s in assets.items():
    (OUT / n).write_text(s, encoding="utf-8")
print("%d fichiers" % len(assets))
