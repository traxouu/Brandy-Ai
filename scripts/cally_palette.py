"""Palette Cally Leads : trois couleurs imposées + les teintes de service dérivées.
Chaque couple réellement employé est vérifié au moins AA."""
import colorsys, json, pathlib, sys
sys.path.insert(0, ".")
from contrast import ratio

def cmyk(c, m, y, k):
    c, m, y, k = c/100, m/100, y/100, k/100
    return "#%02X%02X%02X" % (round(255*(1-c)*(1-k)), round(255*(1-m)*(1-k)), round(255*(1-y)*(1-k)))

def hls(h):
    h = h.lstrip("#"); r,g,b = (int(h[i:i+2],16)/255 for i in (0,2,4))
    return colorsys.rgb_to_hls(r,g,b)
def from_hls(hh, ll, ss):
    r,g,b = colorsys.hls_to_rgb(hh, max(0,min(1,ll)), max(0,min(1,ss)))
    return "#%02X%02X%02X" % tuple(round(c*255) for c in (r,g,b))
def tune(base, bg, target, direction, sat=None):
    h,l,s = hls(base)
    if sat is not None: s = sat
    step = 0.002 * (1 if direction=="lighter" else -1)
    out = from_hls(h,l,s)
    for _ in range(600):
        if ratio(out, bg) >= target: break
        l += step; out = from_hls(h,l,s)
    return out

VIOLET, IVOIRE, ROUGE = cmyk(42,84,0,40), cmyk(0,5,11,7), cmyk(0,76,74,10)
vh,vl,vs = hls(VIOLET); ih,il,isat = hls(IVOIRE); rh,rl,rs = hls(ROUGE)

T = {
  "violet":       (VIOLET, "Principale. Logo, titres, boutons, liens."),
  "ivoire":       (IVOIRE, "Fond de toutes les surfaces claires."),
  "rouge":        (ROUGE,  "Accent. Aplats, pastilles, graphiques — jamais du texte courant."),
}
T["violet-fonce"]  = (from_hls(vh, vl-0.075, min(1, vs+0.05)), "Survol et appui des boutons violets.")
T["violet-clair"]  = (tune(VIOLET, "#14121A", 4.85, "lighter", sat=min(1, vs*0.85)), "Violet lisible sur fond sombre.")
T["violet-voile"]  = (from_hls(vh, 0.93, 0.42), "Fond des surfaces sélectionnées, badges.")
T["rouge-fonce"]   = (tune(ROUGE, IVOIRE, 4.5, "darker"), "Rouge utilisable en texte sur ivoire.")
T["rouge-voile"]   = (from_hls(rh, 0.93, 0.60), "Fond des messages d'erreur.")
T["ivoire-creuse"] = (from_hls(ih, il-0.045, isat*0.75), "Fond secondaire, jauges, aplats de repos.")
T["filet"]         = (from_hls(ih, il-0.105, isat*0.45), "Filets, bordures de cartes et de champs.")
T["surface"]       = ("#FFFCF8", "Fond des cartes, au-dessus de l'ivoire.")
T["encre"]         = (from_hls(vh, 0.09, 0.16), "Texte courant. Un noir teinté de violet, pas un gris neutre.")
T["encre-douce"]   = (from_hls(vh, 0.26, 0.12), "Texte secondaire, paragraphes longs.")
T["encre-tenue"]   = (tune(from_hls(vh, 0.42, 0.10), IVOIRE, 4.5, "darker"), "Légendes, métadonnées.")

print("%-15s %-9s %8s %8s  %s" % ("jeton","hex","/ivoire","/encre","rôle"))
print("-"*112)
ENCRE = T["encre"][0]
for k,(hx,role) in T.items():
    print("%-15s %-9s %7.2f:1 %7.2f:1  %s" % (k, hx, ratio(hx, IVOIRE), ratio(hx, ENCRE), role))

checks = [
 ("Encre sur ivoire (corps)",        T["encre"][0], IVOIRE, 4.5),
 ("Encre douce sur ivoire",          T["encre-douce"][0], IVOIRE, 4.5),
 ("Encre tenue sur ivoire",          T["encre-tenue"][0], IVOIRE, 4.5),
 ("Violet sur ivoire (titres)",      VIOLET, IVOIRE, 4.5),
 ("Ivoire sur violet (bouton)",      IVOIRE, VIOLET, 4.5),
 ("Ivoire sur violet foncé",         IVOIRE, T["violet-fonce"][0], 4.5),
 ("Violet clair sur encre",          T["violet-clair"][0], T["encre"][0], 4.5),
 ("Violet sur violet voilé",         VIOLET, T["violet-voile"][0], 4.5),
 ("Rouge foncé sur rouge voilé",     T["rouge-fonce"][0], T["rouge-voile"][0], 4.5),
 ("Rouge foncé sur ivoire",          T["rouge-fonce"][0], IVOIRE, 4.5),
 ("Blanc sur noir",                  "#FFFFFF", "#000000", 4.5),
]
print("\n%-34s %8s  état" % ("contrôle","ratio")); print("-"*58)
ok = True
for name, fg, bg, need in checks:
    r = ratio(fg,bg); good = r >= need; ok &= good
    print("%-34s %7.2f:1  %s" % (name, r, "OK" if good else "ECHEC"))
print("\nPalette conforme AA." if ok else "\nAu moins un couple échoue.")
print("\nÀ proscrire : rouge sur violet = %.2f:1" % ratio(ROUGE, VIOLET))

pathlib.Path("cally_palette.json").write_text(
    json.dumps({k: {"hex": v[0], "role": v[1]} for k,v in T.items()}, ensure_ascii=False, indent=2),
    encoding="utf-8")
