"""CMYK -> RGB. Sans profil ICC la conversion est approximative : ces valeurs
sont la conversion naïve, celle qu'appliquent les navigateurs et la plupart
des outils écran. Un profil Fogra/SWOP donnerait des valeurs légèrement autres."""
import json, pathlib, sys
sys.path.insert(0, ".")
from contrast import ratio

def cmyk(c, m, y, k):
    c, m, y, k = c / 100, m / 100, y / 100, k / 100
    r = round(255 * (1 - c) * (1 - k))
    g = round(255 * (1 - m) * (1 - k))
    b = round(255 * (1 - y) * (1 - k))
    return "#%02X%02X%02X" % (r, g, b)

SRC = {
    "violet": ((42, 84, 0, 40), "Première — couleur principale"),
    "ivoire": ((0, 5, 11, 7),   "Seconde — fond"),
    "rouge":  ((0, 76, 74, 10), "Troisième — accent"),
}
P = {k: {"cmyk": v[0], "hex": cmyk(*v[0]), "role": v[1]} for k, v in SRC.items()}
P["noir"]  = {"cmyk": None, "hex": "#000000", "role": "Version monochrome"}
P["blanc"] = {"cmyk": None, "hex": "#FFFFFF", "role": "Version monochrome inversée"}

for k, v in P.items():
    if v["cmyk"]:
        print("%-7s CMYK %-16s -> %s" % (k, str(v["cmyk"]), v["hex"]))

print()
pairs = [("violet", "ivoire"), ("rouge", "ivoire"), ("ivoire", "violet"),
         ("rouge", "violet"), ("violet", "blanc"), ("blanc", "violet"),
         ("noir", "blanc"), ("blanc", "noir")]
print("%-24s %8s  %s" % ("couple", "ratio", "verdict"))
print("-" * 52)
for a, b in pairs:
    r = ratio(P[a]["hex"], P[b]["hex"])
    v = "AAA" if r >= 7 else "AA" if r >= 4.5 else "AA grand" if r >= 3 else "insuffisant"
    print("%-24s %7.2f:1  %s" % ("%s sur %s" % (a, b), r, v))

pathlib.Path("marka_palette.json").write_text(json.dumps(P, ensure_ascii=False, indent=2), encoding="utf-8")
