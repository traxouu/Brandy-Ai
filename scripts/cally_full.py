"""Kit complet Cally Leads : logos, étoile, icônes d'application, image sociale."""
import math, json, pathlib, sys
sys.path.insert(0, ".")
from outline import text_to_path

P = {k: v["hex"] for k, v in json.loads(pathlib.Path("cally_palette.json").read_text(encoding="utf-8")).items()}
OUT = pathlib.Path("cally_final"); OUT.mkdir(exist_ok=True)
SW, CD, CAP = "switzer-500.ttf", "clash-600.ttf", 68.0
GSCALE, GAP, TR = 1.015, 26.0, -0.004
R, RIN, SWEEP, BEND, SHARP, TILT = 46.0, 9.0, 22.0, 0.42, 0.58, 25.0

def pol(r, a, cx=50.0, cy=50.0):
    t = math.radians(a-90); return cx+r*math.cos(t), cy+r*math.sin(t)
def star_path():
    step, d = 90.0, []
    for i in range(4):
        a = TILT+i*step
        v0, v1 = pol(RIN, a-step/2+SWEEP), pol(RIN, a+step/2+SWEEP); tip = pol(R, a)
        c0 = pol(R*BEND, a-step/2*(1-SHARP)+SWEEP*0.5); c1 = pol(R*BEND, a+step/2*(1-SHARP)+SWEEP*0.5)
        if i == 0: d.append("M%.2f %.2f" % v0)
        d.append("Q%.2f %.2f %.2f %.2f" % (c0+tip)); d.append("Q%.2f %.2f %.2f %.2f" % (c1+v1))
    return "".join(d)+"Z"
STAR = star_path()
SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.2f %.2f %.2f %.2f" role="img" '
       'aria-label="Cally Leads">%s</svg>')

def two_fonts(color, size=100, stacked=False):
    a = text_to_path(SW, "Cally", size=size, tracking=TR, origin=(0,0))
    b = text_to_path(CD, "Leads", size=size*GSCALE, tracking=TR, origin=(0,0))
    if stacked:
        lead = size*0.95
        body = ('<g transform="translate(%.2f %.2f)"><path d="%s" fill="%s"/></g>'
                '<g transform="translate(%.2f 0)"><path d="%s" fill="%s"/></g>'
                % (-a["bounds"][0], -lead, a["d"], color, -b["bounds"][0], b["d"], color))
        w = max(a["bounds"][2]-a["bounds"][0], b["bounds"][2]-b["bounds"][0])
        return body, (0.0, -lead+a["bounds"][1], w, b["bounds"][3])
    x = a["advance"]+GAP
    body = ('<path d="%s" fill="%s"/><g transform="translate(%.2f 0)"><path d="%s" fill="%s"/></g>'
            % (a["d"], color, x, b["d"], color))
    return body, (min(a["bounds"][0], x+b["bounds"][0]), min(a["bounds"][1], b["bounds"][1]),
                  max(a["bounds"][2], x+b["bounds"][2]), max(a["bounds"][3], b["bounds"][3]))

def symbol(color): return SVG % (0,0,100,100, '<path d="%s" fill="%s"/>' % (STAR, color))
def word(color):
    body,(x0,y0,x1,y1) = two_fonts(color); p=5.0
    return SVG % (x0-p, y0-p, x1-x0+2*p, y1-y0+2*p, body)

def lockup(color, mode="h"):
    p = 5.0
    if mode == "h":
        body,(x0,y0,x1,y1) = two_fonts(color)
        sym,g = CAP*1.62, CAP*0.32; sy = -CAP/2-sym/2
        full = ('<g transform="translate(0 %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
                '<g transform="translate(%.2f 0)">%s</g>' % (sy, sym/100, STAR, color, sym+g-x0, body))
        vy = min(sy,y0)
        return SVG % (-p, vy-p, sym+g+(x1-x0)+2*p, max(sy+sym,y1)-vy+2*p, full)
    if mode == "hs":
        body,(x0,y0,x1,y1) = two_fonts(color, stacked=True)
        h = y1-y0; sym,g = h*0.74, CAP*0.42
        full = ('<g transform="translate(0 %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
                '<g transform="translate(%.2f 0)">%s</g>' % (y0+(h-sym)/2, sym/100, STAR, color, sym+g, body))
        return SVG % (-p, y0-p, sym+g+(x1-x0)+2*p, h+2*p, full)
    body,(x0,y0,x1,y1) = two_fonts(color)
    sym,g = CAP*1.95, CAP*0.36
    full = ('<g transform="translate(%.2f %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
            '<g transform="translate(%.2f 0)">%s</g>'
            % ((x1-x0-sym)/2, y0-g-sym, sym/100, STAR, color, -x0, body))
    return SVG % (-p, y0-g-sym-p, (x1-x0)+2*p, g+sym+(y1-y0)+2*p, full)

def plate(bg, fg, shape="circle", fill=0.62):
    s = fill
    inner = ('<g transform="translate(%.2f %.2f) scale(%.4f)"><path d="%s" fill="%s"/></g>'
             % (50-50*s, 50-50*s, s, STAR, fg))
    base = ('<circle cx="50" cy="50" r="50" fill="%s"/>' % bg if shape=="circle"
            else '<rect width="100" height="100" fill="%s"/>' % bg)
    return SVG % (0,0,100,100, base+inner)

V,I,RG,N,B = P["violet"], P["ivoire"], P["rouge"], "#000000", "#FFFFFF"
assets = {}
for sfx,col in (("",V), ("-ivoire",I), ("-noir",N), ("-blanc",B)):
    assets["cally-logo%s.svg"%sfx]            = lockup(col,"h")
    assets["cally-logo-deux-lignes%s.svg"%sfx] = lockup(col,"hs")
    assets["cally-logo-vertical%s.svg"%sfx]    = lockup(col,"v")
    assets["cally-mot%s.svg"%sfx]              = word(col)
    assets["cally-etoile%s.svg"%sfx]           = symbol(col)
assets["cally-etoile-rouge.svg"] = symbol(RG)
assets["favicon.svg"]      = plate(V, I, "circle")
assets["avatar.svg"]       = plate(V, I, "circle")
assets["icone-carree.svg"] = plate(V, I, "square")
for n,s in assets.items(): (OUT/n).write_text(s, encoding="utf-8")
print("%d fichiers" % len(assets))
