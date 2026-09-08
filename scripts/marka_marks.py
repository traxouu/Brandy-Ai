"""Pistes de symbole pour Marka. Géométrie exacte, boîte 100x100, centre 50,50."""
import math, json, pathlib

def svg(body, vb="0 0 100 100"):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img" '
            'aria-label="Marka">%s</svg>' % (vb, body))

def F(fill="CUR"):   return 'fill="%s"' % fill
def S(sw, cap="butt"):
    return 'fill="none" stroke="CUR" stroke-width="%s" stroke-linecap="%s"' % (sw, cap)

# — A. Mire de repérage : le repère d'imprimeur, la croix qui dépasse du cercle.
A = svg('<circle cx="50" cy="50" r="30" %s/>'
        '<path d="M50 2V98M2 50H98" %s/>'
        % (S(9), S(9)))

# — B. Cible pleine : anneau + point.
B = svg('<circle cx="50" cy="50" r="34" %s/><circle cx="50" cy="50" r="14" %s/>'
        % (S(12), F()))

# — C. Étoile concave à quatre branches (astroïde), pleine.
def astroid(r_arc=1.02, R=48, hole=0):
    c = 50
    p = ("M %g %g A %g %g 0 0 0 %g %g A %g %g 0 0 0 %g %g "
         "A %g %g 0 0 0 %g %g A %g %g 0 0 0 %g %g Z") % (
        c + R, c, R * r_arc, R * r_arc, c, c + R,
        R * r_arc, R * r_arc, c - R, c,
        R * r_arc, R * r_arc, c, c - R,
        R * r_arc, R * r_arc, c + R, c)
    if hole:
        p += " M %g %g m -%g 0 a %g %g 0 1 0 %g 0 a %g %g 0 1 0 -%g 0 Z" % (
            c, c, hole, hole, hole, hole * 2, hole, hole, hole * 2)
    return p

C = svg('<path d="%s" %s/>' % (astroid(), F()))
D = svg('<path d="%s" fill-rule="evenodd" %s/>' % (astroid(hole=15), F()))

# — E. Quatre-feuilles : quatre disques réunis.
E = svg("".join('<circle cx="%g" cy="%g" r="25" %s/>' % (x, y, F())
                for x, y in ((50, 27), (73, 50), (50, 73), (27, 50))))

# — F. Diaphragme : cinq lames en rotation.
def blade(i, n=5, R=44, w=0.62):
    a0 = 2 * math.pi * i / n
    a1 = a0 + 2 * math.pi * w / n
    x0, y0 = 50 + R * math.cos(a0), 50 + R * math.sin(a0)
    x1, y1 = 50 + R * math.cos(a1), 50 + R * math.sin(a1)
    return "M50 50L%.2f %.2fA%g %g 0 0 1 %.2f %.2fZ" % (x0, y0, R, R, x1, y1)
F_ = svg('<path d="%s" %s/>' % ("".join(blade(i) for i in range(5)), F()))

# — G. Cadre de cadrage : quatre équerres et un point.
eq = 26
G = svg('<path d="M6 %g V6 H%g M%g 6 H94 V%g M94 %g V94 H%g M%g 94 H6 V%g" %s/>'
        '<circle cx="50" cy="50" r="11" %s/>'
        % (eq, eq, 100 - eq, eq, 100 - eq, 100 - eq, eq, 100 - eq, S(9), F()))

# — H. Croix pleine décalée : le geste de marquer.
H = svg('<path d="M38 6h24v32h32v24H62v32H38V62H6V38h32z" %s/>' % F())

# — I. Orbite : ellipse inclinée et disque, clin d'œil Y2K.
I = svg('<g transform="rotate(-28 50 50)"><ellipse cx="50" cy="50" rx="46" ry="20" %s/></g>'
        '<circle cx="50" cy="50" r="16" %s/>' % (S(9), F()))

# — J. Bloc entaillé : un tampon, une matrice.
J = svg('<path d="M8 8h84v84H8z M8 8 L50 50 L8 92 Z" fill-rule="evenodd" %s/>' % F())

MARKS = {"A_mire": A, "B_cible": B, "C_astroide": C, "D_astroide_perce": D,
         "E_quatrefeuille": E, "F_diaphragme": F_, "G_cadrage": G,
         "H_croix": H, "I_orbite": I, "J_bloc": J}

pathlib.Path("marka_marks.json").write_text(json.dumps(MARKS), encoding="utf-8")
for k, v in MARKS.items():
    print("%-18s %4d octets" % (k, len(v)))
