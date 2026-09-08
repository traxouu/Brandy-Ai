"""Assets de marque Brandy AI — wordmark une couleur, Sentient regular, traitement minimal."""
import json, pathlib
from outline import text_to_path

P = json.loads(pathlib.Path("palette.json").read_text(encoding="utf-8"))
C = {k: v["hex"] for k, v in P.items()}
SENTIENT = "sentient-400.ttf"          # regular, comme demandé
OUT = pathlib.Path("assets"); OUT.mkdir(exist_ok=True)

HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Brandy AI">'


def wordmark(color, tracking=0.010, size=100):
    """« Brandy AI » d'un seul tenant : la chasse d'espace vient de la police."""
    g = text_to_path(SENTIENT, "Brandy AI", size=size, tracking=tracking, origin=(0, 0))
    x0, y0, x1, y1 = g["bounds"]
    pad = size * 0.05
    vb = f"{x0-pad:.2f} {y0-pad:.2f} {x1-x0+2*pad:.2f} {y1-y0+2*pad:.2f}"
    return HEAD.format(vb=vb) + f'<path d="{g["d"]}" fill="{color}"/></svg>'


def mark(color, size=100):
    """Monogramme minimal : le B de Sentient regular, sans contenant."""
    g = text_to_path(SENTIENT, "B", size=size, origin=(0, 0))
    x0, y0, x1, y1 = g["bounds"]
    pad = size * 0.05
    vb = f"{x0-pad:.2f} {y0-pad:.2f} {x1-x0+2*pad:.2f} {y1-y0+2*pad:.2f}"
    return HEAD.format(vb=vb) + f'<path d="{g["d"]}" fill="{color}"/></svg>'


def mark_plate(bg, fg, fill=0.60, shape="circle"):
    """Variante pleine, réservée aux contextes qui imposent un fond opaque (icône iOS)."""
    g = text_to_path(SENTIENT, "B", size=100, origin=(0, 0))
    gx0, gy0, gx1, gy1 = g["bounds"]
    gw, gh = gx1 - gx0, gy1 - gy0
    s = (100 * fill) / gh
    tx = 50 - (gx0 + gw / 2) * s
    ty = 50 - (gy0 + gh / 2) * s
    plate = ('<circle cx="50" cy="50" r="50" fill="%s"/>' % bg if shape == "circle"
             else '<rect width="100" height="100" fill="%s"/>' % bg)
    return (HEAD.format(vb="0 0 100 100") + plate
            + f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})">'
              f'<path d="{g["d"]}" fill="{fg}"/></g></svg>')


assets = {
    # Wordmark : le nom entier en couleur principale.
    "logo.svg":           wordmark(C["brand"]),
    # Sur fond encre, le bordeaux tombe à 2,34:1 : on passe à sa teinte claire.
    "logo-reversed.svg":  wordmark(C["brand-light"]),
    "logo-cream.svg":     wordmark(C["cream"]),
    "logo-ink.svg":       wordmark(C["ink"]),
    # Monogramme minimal.
    "mark.svg":           mark(C["brand"]),
    "mark-cream.svg":     mark(C["cream"]),
    "mark-ink.svg":       mark(C["ink"]),
    # Variantes pleines pour icônes d'application.
    "mark-plate.svg":     mark_plate(C["brand"], C["cream"]),
    "favicon.svg":        mark_plate(C["brand"], C["cream"]),
}

for name, svg in assets.items():
    (OUT / name).write_text(svg, encoding="utf-8")
    print(f"{name:20} {len(svg):5d} octets")
