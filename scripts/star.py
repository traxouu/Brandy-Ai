"""Vectorisation du croquis : étoile à quatre branches balayées."""
import math, json, pathlib

def P(r, a):
    """Polaire -> cartésien, centre 50,50, angle en degrés, 0 = midi."""
    t = math.radians(a - 90)
    return 50 + r * math.cos(t), 50 + r * math.sin(t)

def star(R=46, r=9, sweep=22, bend=0.42, tilt=0, arms=4, sharp=0.55):
    """
    R      rayon des pointes
    r      rayon du creux entre deux branches
    sweep  décalage angulaire du creux : c'est lui qui donne le balayage
    bend   position du point de contrôle sur le rayon (courbure des flancs)
    tilt   rotation d'ensemble
    sharp  écrasement du contrôle vers la pointe : plus il monte, plus c'est effilé
    """
    step = 360.0 / arms
    d = []
    for i in range(arms):
        a_tip = tilt + i * step
        a_in0 = a_tip - step / 2 + sweep      # creux avant la pointe
        a_in1 = a_tip + step / 2 + sweep      # creux après la pointe
        tip = P(R, a_tip)
        v0, v1 = P(r, a_in0), P(r, a_in1)
        # Contrôles tirés vers la pointe : flancs concaves, branche effilée.
        c0 = P(R * bend, a_tip - step / 2 * (1 - sharp) + sweep * 0.5)
        c1 = P(R * bend, a_tip + step / 2 * (1 - sharp) + sweep * 0.5)
        if i == 0:
            d.append("M%.2f %.2f" % v0)
        d.append("Q%.2f %.2f %.2f %.2f" % (c0 + tip))
        d.append("Q%.2f %.2f %.2f %.2f" % (c1 + v1))
    d.append("Z")
    return "".join(d)

def svg(body, vb="0 0 100 100"):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img" '
            'aria-label="Marka">%s</svg>' % (vb, body))

def solid(d, color="CUR"):
    return svg('<path d="%s" fill="%s"/>' % (d, color))

def outline(d, sw=6, color="CUR"):
    return svg('<path d="%s" fill="none" stroke="%s" stroke-width="%g" '
               'stroke-linejoin="round"/>' % (d, color, sw))

VAR = {
    "S1_balaye":        star(sweep=22, bend=0.42, sharp=0.55),
    "S2_balaye_fort":   star(sweep=34, bend=0.46, sharp=0.62),
    "S3_droit":         star(sweep=0,  bend=0.40, sharp=0.50),
    "S4_effile":        star(sweep=24, bend=0.34, sharp=0.72, r=7),
    "S5_trapu":         star(sweep=20, bend=0.50, sharp=0.40, r=13, R=44),
    "S6_incline":       star(sweep=24, bend=0.42, sharp=0.58, tilt=18),
}
out = {}
for k, d in VAR.items():
    out[k] = {"solid": solid(d), "outline": outline(d)}
pathlib.Path("star_variants.json").write_text(json.dumps(out), encoding="utf-8")
print(" ".join(VAR))
