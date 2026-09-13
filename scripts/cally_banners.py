"""Bannières de couverture Cally Leads, aux dimensions exactes de chaque plateforme.

Contrainte commune : l'avatar du compte recouvre une zone de la bannière — en bas
à gauche sur LinkedIn, X et Facebook. Le logo est donc placé à droite du centre
sur ces formats, jamais dans la zone masquée."""
import json, pathlib

BR = pathlib.Path("/home/user/Brandy-Ai/public/brand/cally")
P = {k: v["hex"] for k, v in json.loads(pathlib.Path("cally_palette.json").read_text(encoding="utf-8")).items()}
A = {p.stem: p.read_text(encoding="utf-8") for p in BR.glob("*.svg")}
OUT = pathlib.Path("banners"); OUT.mkdir(exist_ok=True)

def sized(svg, style):
    return svg.replace("<svg", '<svg style="%s"' % style, 1)

# Dimensions officielles. safe = zone visible garantie (YouTube) ; avatar = zone
# recouverte par la photo de profil, à laisser vide.
FORMATS = [
    # nom,                  largeur, hauteur, hauteur logo, avatar à éviter, note
    ("linkedin-page",        1128,  191,  86,  "left",   "Couverture de page LinkedIn"),
    ("linkedin-profil",      1584,  396, 150,  "left",   "Bannière de profil LinkedIn"),
    ("x-header",             1500,  500, 170,  "left",   "En-tête X / Twitter"),
    ("facebook-couverture",   820,  312, 120,  "left",   "Couverture Facebook"),
    ("youtube",              2560, 1440, 230,  "none",   "Bannière YouTube, zone sûre 1546×423"),
]

def banner(key, w, h, logo_h, avatar, variant):
    """variant : 'violet' = aplat violet, logo ivoire ; 'ivoire' = fond clair, logo violet."""
    if variant == "violet":
        ground, logo, star = P["violet"], "cally-logo-ivoire", P["violet-fonce"]
    else:
        ground, logo, star = P["ivoire"], "cally-logo", P["ivoire-creuse"]

    # Étoile en filigrane, très en retrait, calée sur le bord droit.
    wm_size = int(h * 1.55)
    watermark = (
        '<div style="position:absolute;right:%dpx;top:50%%;transform:translateY(-50%%);'
        'width:%dpx;height:%dpx;opacity:1;pointer-events:none">%s</div>'
        % (int(-wm_size * 0.22), wm_size, wm_size,
           sized(A["cally-etoile"].replace('fill="%s"' % P["violet"], 'fill="%s"' % star),
                 "width:100%;height:100%;display:block")))

    # Décalage vers la droite quand l'avatar occupe la gauche.
    if avatar == "left":
        pad_left = int(w * 0.19)
        justify = "flex-start"
    else:
        pad_left = 0
        justify = "center"

    inner = ('<div style="position:relative;z-index:1;display:flex;align-items:center;'
             'justify-content:%s;height:100%%;padding-left:%dpx">%s</div>'
             % (justify, pad_left,
                sized(A[logo], "height:%dpx;width:auto;display:block" % logo_h)))

    # YouTube : le contenu doit tenir dans la zone sûre centrale.
    if key == "youtube":
        inner = ('<div style="position:relative;z-index:1;width:1546px;height:423px;'
                 'margin:%dpx auto 0;display:flex;align-items:center;justify-content:center">%s</div>'
                 % ((h - 423) // 2,
                    sized(A[logo], "height:%dpx;width:auto;display:block" % logo_h)))

    return ('<!doctype html><meta charset="utf-8">'
            '<body style="margin:0;background:#1a1a1a">'
            '<div style="width:%dpx;height:%dpx;background:%s;overflow:hidden;'
            'position:relative">%s%s</div></body>'
            % (w, h, ground, watermark, inner))

jobs = []
for key, w, h, lh, avatar, note in FORMATS:
    for variant in ("violet", "ivoire"):
        f = "b_%s_%s.html" % (key, variant)
        pathlib.Path(f).write_text(banner(key, w, h, lh, avatar, variant), encoding="utf-8")
        jobs.append((f, "%s-%s.png" % (key, variant), w, h, note))

pathlib.Path("banner_jobs.json").write_text(json.dumps(jobs), encoding="utf-8")
for j in jobs: print("%-34s %d x %d" % (j[1], j[2], j[3]))
