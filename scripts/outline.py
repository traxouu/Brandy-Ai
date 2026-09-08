"""Convertit une chaîne en tracés SVG à partir d'un TTF (glyphes réels, pas de <text>)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.misc.transform import Transform

_cache = {}


def load(ttf):
    if ttf not in _cache:
        font = TTFont(ttf)
        kerns = {}
        if "kern" in font:
            for table in font["kern"].kernTables:
                kerns.update(table.kernTable)
        _cache[ttf] = (font, font.getBestCmap(), font.getGlyphSet(), font["hmtx"], kerns)
    return _cache[ttf]


def text_to_path(ttf, text, size=100, tracking=0.0, origin=(0.0, 0.0)):
    """Renvoie le `d` du tracé, dans un repère SVG, ligne de base en origin[1]."""
    font, cmap, glyphset, hmtx, kerns = load(ttf)
    upem = font["head"].unitsPerEm
    s = size / upem

    names = [cmap[ord(c)] for c in text]
    pen = SVGPathPen(glyphset, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))

    cursor = 0.0  # en unités de police
    minx, miny, maxx, maxy = 1e9, 1e9, -1e9, -1e9
    for i, name in enumerate(names):
        t = Transform(s, 0, 0, -s, origin[0] + cursor * s, origin[1])
        glyphset[name].draw(TransformPen(pen, t))

        bp = BoundsPen(glyphset)
        glyphset[name].draw(bp)
        if bp.bounds:
            a, b, c, d = bp.bounds
            minx = min(minx, origin[0] + (cursor + a) * s)
            maxx = max(maxx, origin[0] + (cursor + c) * s)
            miny = min(miny, origin[1] - d * s)
            maxy = max(maxy, origin[1] - b * s)

        cursor += hmtx[name][0]
        if i + 1 < len(names):
            cursor += kerns.get((name, names[i + 1]), 0)
        cursor += tracking * upem

    return {
        "d": pen.getCommands(),
        "advance": cursor * s,
        "bounds": (minx, miny, maxx, maxy),
    }


def metrics(ttf, size=100):
    font, *_ = load(ttf)
    upem = font["head"].unitsPerEm
    s = size / upem
    os2 = font["OS/2"]
    return {
        "cap": os2.sCapHeight * s if hasattr(os2, "sCapHeight") else None,
        "xheight": os2.sxHeight * s if hasattr(os2, "sxHeight") else None,
        "asc": font["hhea"].ascent * s,
        "desc": font["hhea"].descent * s,
    }


if __name__ == "__main__":
    print("metrics 400:", {k: round(v, 1) for k, v in metrics("sentient-400.ttf").items() if v})
    for txt in ("Brandy", "AI", "B"):
        r = text_to_path("sentient-400.ttf", txt, size=100)
        print(f"{txt:8} advance={r['advance']:7.2f} bounds={[round(v,2) for v in r['bounds']]}")
