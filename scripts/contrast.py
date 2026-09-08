def lum(hexstr):
    h = hexstr.lstrip("#")
    c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def verdict(r, large=False):
    need = 3.0 if large else 4.5
    if r >= 7: return "AAA"
    if r >= 4.5: return "AA"
    if r >= 3.0: return "AA grand" if large else "insuffisant"
    return "insuffisant"

if __name__ == "__main__":
    INK, BRAND, CREAM = "#161A1D", "#A51C30", "#FFF6EC"
    pairs = [
        ("Encre sur Crème",        INK, CREAM, False),
        ("Bordeaux sur Crème",     BRAND, CREAM, False),
        ("Crème sur Bordeaux",     CREAM, BRAND, False),
        ("Crème sur Encre",        CREAM, INK, False),
        ("Bordeaux sur Encre",     BRAND, INK, False),
        ("Bordeaux sur Blanc",     BRAND, "#FFFFFF", False),
    ]
    print(f"{'paire':26} {'ratio':>7}  verdict")
    print("-" * 50)
    for name, fg, bg, large in pairs:
        r = ratio(fg, bg)
        print(f"{name:26} {r:6.2f}:1  {verdict(r, large)}")
