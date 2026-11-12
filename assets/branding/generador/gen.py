"""Genera los logos SVG/PNG de Axhum Tech. Uso: python -I gen.py <py_libs> <font.ttf> <repo>"""
import sys, os
sys.path.insert(0, sys.argv[1]); sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import resvg_py
import iso

FONT, REPO = sys.argv[2], sys.argv[3]
BLOB = hb.Blob.from_file_path(FONT)
FACE = hb.Face(BLOB)
UPEM = FACE.upem


def text_path(txt, size, weight, x, y, tracking=0.0):
    """Texto Montserrat convertido a trazo. tracking en em. Devuelve (d, ancho)."""
    font = hb.Font(FACE)
    font.set_variations({'wght': weight})
    buf = hb.Buffer(); buf.add_str(txt); buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True})
    k = size / UPEM
    pen = SVGPathPen(None, ntos=lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
    cx = 0.0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        tp = TransformPen(pen, (k, 0, 0, -k, x + cx + pos.x_offset * k, y - pos.y_offset * k))
        font.draw_glyph_with_pen(info.codepoint, tp)
        cx += pos.x_advance * k
        if i < n - 1:
            cx += tracking * size
    return pen.getCommands(), cx


def width_of(txt, size, weight, tracking=0.0):
    return text_path(txt, size, weight, 0, 0, tracking)[1]


CAP = 0.70   # altura de mayusculas de Montserrat en em
B = iso.BOX
H = B[3] - B[1]


def wordmark(x, cap_top, cap_h, ink, tag_ink, align='left', cx=None):
    """'AXHUM TECH' + 'SOLUCIONES DIGITALES' con el mismo ancho."""
    size = cap_h / CAP
    w_ax = width_of('AXHUM', size, 700)
    w_sp = width_of('AXHUM ', size, 700) - w_ax
    w_te = width_of('TECH', size, 700)
    total = w_ax + w_sp + w_te
    tag = 'SOLUCIONES DIGITALES'
    tsize = size * 0.36
    base_w = width_of(tag, tsize, 600)
    track = (total - base_w) / (len(tag) - 1) / tsize
    if align == 'center':
        x = cx - total / 2
    base = cap_top + cap_h
    d1, _ = text_path('AXHUM', size, 700, x, base)
    d2, _ = text_path('TECH', size, 700, x + w_ax + w_sp, base)
    tag_base = base + cap_h * 0.92
    d3, tw = text_path(tag, tsize, 600, x, tag_base, track)
    svg = (f'<path fill="{ink}" d="{d1}"/><path fill="{iso.TURQ}" d="{d2}"/>'
           f'<path fill="{tag_ink}" d="{d3}"/>')
    return svg, total, tag_base


def svg_doc(vb, body, title, desc, defs='', w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}"{size} '
            f'role="img" aria-labelledby="t d"><title id="t">{title}</title><desc id="d">{desc}</desc>'
            f'<defs>{defs}</defs>{body}</svg>\n')


def horizontal(dark):
    ink = iso.WHITE if dark else iso.NAVY
    defs, mark = iso.mark_group(ink, uid='h')
    x0 = B[2] + 0.11 * H
    words, total, _ = wordmark(x0, B[1] + 0.25 * H, 0.31 * H, ink, ink)
    pad = 0.04 * H
    vb = (B[0] - pad, B[1] - pad, x0 + total - B[0] + 2 * pad, H + 2 * pad)
    return svg_doc(vb, mark + words, 'Axhum Tech',
                   f'Logo horizontal oficial para fondos {"oscuros" if dark else "claros"}', defs), vb


def vertical(dark):
    ink = iso.WHITE if dark else iso.NAVY
    defs, mark = iso.mark_group(ink, uid='v')
    mcx = (B[0] + B[2]) / 2
    cap_h = 0.27 * H
    words, total, tag_base = wordmark(0, B[3] + 0.16 * H, cap_h, ink, ink, 'center', mcx)
    pad = 0.04 * H
    left = min(B[0], mcx - total / 2) - pad
    right = max(B[2], mcx + total / 2) + pad
    vb = (left, B[1] - pad, right - left, tag_base + pad - B[1] + pad)
    return svg_doc(vb, mark + words, 'Axhum Tech',
                   f'Logo vertical oficial para fondos {"oscuros" if dark else "claros"}', defs), vb


def mark(kind):
    pad = 0.06 * H
    w, h = B[2] - B[0], H
    side = max(w, h) + 2 * pad
    cx, cy = (B[0] + B[2]) / 2, (B[1] + B[3]) / 2
    vb = (cx - side / 2, cy - side / 2, side, side)
    if kind == 'square':
        side2 = side * 1.30
        vb = (cx - side2 / 2, cy - side2 / 2 + 10, side2, side2)
        defs, m = iso.mark_group(iso.WHITE, uid='s')
        bg = f'<rect x="{vb[0]:.0f}" y="{vb[1]:.0f}" width="{side2:.0f}" height="{side2:.0f}" rx="{side2 * 0.22:.0f}" fill="{iso.NAVY}"/>'
        return svg_doc(vb, bg + m, 'Axhum Tech', 'Isotipo cuadrado para iconos y favicon', defs), vb
    if kind == 'mono':
        defs, m = iso.mark_group(iso.NAVY, a_color=iso.NAVY, uid='m')
        return svg_doc(vb, m, 'Axhum Tech', 'Isotipo monocromo', defs), vb
    dark = kind == 'dark'
    defs, m = iso.mark_group(iso.WHITE if dark else iso.NAVY, uid='k')
    return svg_doc(vb, m, 'Axhum Tech', f'Isotipo para fondos {"oscuros" if dark else "claros"}', defs), vb


def og():
    W, Hh = 1200, 630
    s = 150 / H                      # isotipo de 150 px de alto
    defs, m = iso.mark_group(iso.WHITE, uid='o')
    tx, ty = 80 - B[0] * s, 80 - B[1] * s
    x0 = B[2] + 0.11 * H
    words, _, _ = wordmark(x0, B[1] + 0.25 * H, 0.31 * H, iso.WHITE, iso.WHITE)
    logo = f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">{m}{words}</g>'
    l1, _ = text_path('Diseñamos lo que tu negocio', 60, 700, 80, 395)
    l2, w2 = text_path('necesita para ', 60, 700, 80, 470)
    l3, _ = text_path('avanzar.', 60, 700, 80 + w2, 470)
    sub, _ = text_path('Software a medida · Web · CRM · Automatización', 25, 500, 82, 545)
    body = (f'<rect width="{W}" height="{Hh}" fill="{iso.NAVY}"/>'
            f'<rect x="0" y="{Hh - 10}" width="{W}" height="10" fill="{iso.TURQ}"/>' + logo +
            f'<path fill="#fff" d="{l1}"/><path fill="#fff" d="{l2}"/><path fill="{iso.TURQ}" d="{l3}"/>'
            f'<path fill="#94A3B8" d="{sub}"/>')
    return svg_doc((0, 0, W, Hh), body, 'Axhum Tech', 'Imagen para compartir la web', defs, W, Hh)


def instagram(kind):
    """Foto de perfil 1080x1080: isotipo centrado dentro del circulo de recorte."""
    W = 1080
    w = B[2] - B[0]
    s = 640 / w                         # isotipo de 640 px de ancho
    tx = W / 2 - (B[0] + w / 2) * s
    ty = W / 2 - (B[1] + H / 2) * s + 12  # leve ajuste optico hacia abajo
    if kind == 'azul':
        bg = (f'<rect width="{W}" height="{W}" fill="{iso.NAVY}"/>'
              f'<rect width="{W}" height="{W}" fill="url(#ga)"/>')
        defs_bg = ('<radialGradient id="ga" cx="1" cy="1" r="1.05">'
                   '<stop offset="0" stop-color="#18C4B8" stop-opacity=".38"/>'
                   '<stop offset=".6" stop-color="#18C4B8" stop-opacity="0"/></radialGradient>')
        defs, m = iso.mark_group(iso.WHITE, uid='ia')
    elif kind == 'blanco':
        bg, defs_bg = f'<rect width="{W}" height="{W}" fill="#FFFFFF"/>', ''
        defs, m = iso.mark_group(iso.NAVY, uid='ib')
    elif kind == 'turquesa':
        bg, defs_bg = f'<rect width="{W}" height="{W}" fill="{iso.TURQ}"/>', ''
        defs, m = iso.mark_group(iso.NAVY, a_color=iso.WHITE, uid='it')
    else:
        bg, defs_bg = '', ''
        defs, m = iso.mark_group(iso.NAVY, uid='ix')
    body = bg + f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">{m}</g>'
    return svg_doc((0, 0, W, W), body, 'Axhum Tech', f'Foto de perfil de Instagram, fondo {kind}',
                   defs_bg + defs, W, W)


def png(svg, path, width):
    data = resvg_py.svg_to_bytes(svg_string=svg, width=width)
    open(path, 'wb').write(bytes(data))


def main():
    L = os.path.join(REPO, 'assets/branding/logos')
    out = {}
    for dark in (False, True):
        sv, vb = horizontal(dark); out[f'axhum-tech-logo-on-{"dark" if dark else "light"}.svg'] = sv
        if not dark: hvb = vb
        sv, vb = vertical(dark); out[f'axhum-tech-logo-vertical-on-{"dark" if dark else "light"}.svg'] = sv
    for k, name in (('light', 'axhum-mark-on-light.svg'), ('dark', 'axhum-mark-on-dark.svg'),
                    ('mono', 'axhum-mark-monochrome.svg'), ('square', 'axhum-mark-square.svg')):
        out[name] = mark(k)[0]
    for name, sv in out.items():
        open(os.path.join(L, name), 'w', encoding='utf-8').write(sv)
    sq = out['axhum-mark-square.svg']
    open(os.path.join(REPO, 'public/favicon.svg'), 'w', encoding='utf-8').write(sq)
    png(sq, os.path.join(REPO, 'public/favicon-512.png'), 512)
    o = og()
    open(os.path.join(REPO, 'assets/branding/social/axhum-tech-og.svg'), 'w', encoding='utf-8').write(o)
    png(o, os.path.join(REPO, 'assets/branding/social/axhum-tech-og.png'), 1200)
    png(out['axhum-tech-logo-on-light.svg'], os.path.join(REPO, 'assets/branding/previews/axhum-tech-logo-on-light.png'), 1200)
    png(out['axhum-tech-logo-on-light.svg'], os.path.join(L, 'axhum-tech-logo-professional-50kb.png'), 900)
    IG = os.path.join(REPO, 'assets/branding/social/instagram')
    for kind in ('azul', 'blanco', 'turquesa', 'transparente'):
        sv = instagram(kind)
        open(os.path.join(IG, f'axhum-perfil-{kind}.svg'), 'w', encoding='utf-8').write(sv)
        png(sv, os.path.join(IG, f'axhum-perfil-{kind}.png'), 1080)
    print('aspect horizontal', round(hvb[2] / hvb[3], 4))
    for n, sv in out.items():
        print(n, len(sv))


if __name__ == "__main__":
    main()
