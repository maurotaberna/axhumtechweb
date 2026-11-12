"""Carrusel de presentacion de la marca (4 x 1080x1350).
Uso: python -I post_presentacion.py <py_libs> <Montserrat.ttf> <repo>"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen, iso
from gen import text_path, width_of, wordmark, B, H, png

W, HH = 1080, 1350
NAVY, TURQ, WHITE = iso.NAVY, iso.TURQ, '#FFFFFF'
SOFT = '#CBD5E1'
MUTED = '#5B6B80'
ACCENT = '#08766F'
OUT = os.path.join(gen.REPO, 'assets/branding/social/instagram/presentacion')


def t(txt, size, weight, x, y, color, align='left', tracking=0.0):
    w = width_of(txt, size, weight, tracking)
    if align == 'center':
        x = x - w / 2
    elif align == 'right':
        x = x - w
    d, _ = text_path(txt, size, weight, x, y, tracking)
    return f'<path fill="{color}" d="{d}"/>'


def lines(rows, size, weight, x, y, lh, color, align='left'):
    return ''.join(t(r, size, weight, x, y + i * lh, color, align) for i, r in enumerate(rows))


def navy_bg(uid):
    defs = (f'<radialGradient id="{uid}g" cx="1" cy="1" r="1.05">'
            '<stop offset="0" stop-color="#18C4B8" stop-opacity=".34"/>'
            '<stop offset=".62" stop-color="#18C4B8" stop-opacity="0"/></radialGradient>')
    # estela gigante y tenue como textura
    deco = (f'<g transform="translate(140 760) scale(1.25)" opacity=".06">'
            f'<path fill="#FFFFFF" d="{iso.SWOOSH}"/></g>')
    body = (f'<rect width="{W}" height="{HH}" fill="{NAVY}"/>'
            f'<rect width="{W}" height="{HH}" fill="url(#{uid}g)"/>{deco}')
    return defs, body


def place_mark(swoosh, cx, top, width, uid, a_color=TURQ):
    defs, m = iso.mark_group(swoosh, a_color=a_color, uid=uid)
    s = width / (B[2] - B[0])
    tx = cx - (B[0] + (B[2] - B[0]) / 2) * s
    ty = top - B[1] * s
    return defs, f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">{m}</g>'


def vertical_logo(cx, top, width, uid):
    defs, m = iso.mark_group(WHITE, uid=uid)
    mcx = (B[0] + B[2]) / 2
    words, total, tag_base = wordmark(0, B[3] + 0.16 * H, 0.27 * H, WHITE, WHITE, 'center', mcx)
    left = min(B[0], mcx - total / 2)
    right = max(B[2], mcx + total / 2)
    s = width / (right - left)
    tx = cx - ((left + right) / 2) * s
    ty = top - B[1] * s
    return defs, f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">{m}{words}</g>', (tag_base - B[1]) * s


def horizontal_logo(x, top, width, uid, dark=True):
    ink = WHITE if dark else NAVY
    defs, m = iso.mark_group(ink, uid=uid)
    x0 = B[2] + 0.11 * H
    words, total, _ = wordmark(x0, B[1] + 0.25 * H, 0.31 * H, ink, ink)
    s = width / (x0 + total - B[0])
    tx, ty = x - B[0] * s, top - B[1] * s
    return defs, f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">{m}{words}</g>'


def pager(n, color):
    return t(f'0{n} / 04', 22, 700, 90, 1270, color, tracking=0.18)


def arrow(x, y, color):
    return (f'<path d="M{x} {y} H{x + 46} M{x + 30} {y - 15} L{x + 46} {y} L{x + 30} {y + 15}" fill="none" '
            f'stroke="{color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')


def doc(defs, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {HH}" width="{W}" height="{HH}">'
            f'<title>{title}</title><defs>{defs}</defs>{body}</svg>\n')


def slide1():
    d0, bg = navy_bg('a')
    d1, logo, lh = vertical_logo(W / 2, 250, 600, 'a1')
    y = 250 + lh + 150
    body = (bg + t('NUEVA IDENTIDAD', 26, 700, W / 2, 165, TURQ, 'center', 0.22) + logo +
            lines(['Renovamos', 'nuestra imagen.'], 80, 700, W / 2, y, 92, WHITE, 'center') +
            t('Mismo equipo. Misma forma de trabajar.', 32, 500, W / 2, y + 170, SOFT, 'center') +
            pager(1, TURQ) + t('Deslizá', 24, 600, W - 160, 1270, SOFT, 'right') + arrow(W - 140, 1262, TURQ))
    return doc(d0 + d1, body, 'Axhum Tech - nueva identidad (1/4)')


def slide2():
    d0, bg = navy_bg('b')
    d1, mark = place_mark(WHITE, W / 2, 170, 600, 'b1')
    body = (bg + mark +
            t('Una A que avanza.', 74, 700, W / 2, 860, WHITE, 'center') +
            lines(['La A de Axhum, atravesada por una estela:',
                   'la idea de llevar cada negocio',
                   'un paso más adelante.'], 34, 500, W / 2, 950, 52, SOFT, 'center') +
            pager(2, TURQ))
    return doc(d0 + d1, body, 'Axhum Tech - el isotipo (2/4)')


# iconos de linea en una caja de 0..100
ICONS = [
    ('Software a medida', 'Sistemas pensados para tu operación real.',
     '<rect x="14" y="20" width="72" height="48" rx="6"/><path d="M40 82 H60 M50 68 V82 M30 56 V48 M42 56 V40 M54 56 V44 M66 56 V32"/>'),
    ('Webs y tiendas online', 'Presencia digital que presenta y vende.',
     '<rect x="12" y="18" width="76" height="64" rx="6"/><path d="M12 34 H88 M24 48 H50 V70 H24 Z M60 50 H78 M60 60 H78 M60 70 H72"/>'),
    ('Automatizaciones', 'Menos tareas repetitivas, más tiempo.',
     '<circle cx="22" cy="68" r="9"/><circle cx="50" cy="40" r="9"/><circle cx="78" cy="58" r="9"/><path d="M29 61 L43 47 M58 44 L70 52"/>'),
    ('Productos propios', 'Axhum Gestión, Axenda y más, listos para usar.',
     '<rect x="16" y="16" width="30" height="30" rx="5"/><rect x="54" y="16" width="30" height="30" rx="5"/><rect x="16" y="54" width="30" height="30" rx="5"/><rect x="54" y="54" width="30" height="30" rx="5"/>'),
]


def slide3():
    body = f'<rect width="{W}" height="{HH}" fill="#FFFFFF"/>'
    body += f'<rect x="0" y="0" width="{W}" height="14" fill="{TURQ}"/>'
    body += t('QUÉ HACEMOS', 26, 700, 90, 180, ACCENT, tracking=0.22)
    body += lines(['Soluciones digitales', 'a la medida de tu negocio.'], 56, 700, 90, 270, 68, NAVY)
    y0 = 430
    for i, (title, desc, icon) in enumerate(ICONS):
        y = y0 + i * 190
        body += (f'<rect x="90" y="{y}" width="124" height="124" rx="30" fill="{NAVY}"/>'
                 f'<g transform="translate(110 {y + 20}) scale(.84)" fill="none" stroke="{TURQ}" stroke-width="6" '
                 f'stroke-linecap="round" stroke-linejoin="round">{icon}</g>')
        body += t(title, 36, 700, 250, y + 52, NAVY)
        body += t(desc, 27, 500, 250, y + 98, MUTED)
    body += pager(3, ACCENT)
    return doc('', body, 'Axhum Tech - que hacemos (3/4)')


def slide4():
    d0, bg = navy_bg('d')
    d1, logo = horizontal_logo(90, 1150, 420, 'd1')
    body = (bg + lines(['¿Tenés una idea', 'o un problema', 'para resolver?'], 78, 700, 90, 330, 94, WHITE) +
            t('Contanos qué necesitás.', 50, 700, 90, 640, TURQ) +
            f'<rect x="90" y="720" width="120" height="6" rx="3" fill="{TURQ}"/>' +
            t('axhumtech.com', 42, 700, 90, 830, WHITE) +
            t('Escribinos por mensaje directo', 30, 500, 90, 890, SOFT) +
            t('o desde el link de la bio.', 30, 500, 90, 935, SOFT) +
            logo)
    return doc(d0 + d1, body, 'Axhum Tech - contacto (4/4)')


os.makedirs(OUT, exist_ok=True)
for i, fn in enumerate([slide1, slide2, slide3, slide4], 1):
    svg = fn()
    base = os.path.join(OUT, f'presentacion-{i}')
    open(base + '.svg', 'w', encoding='utf-8', newline='\n').write(svg)
    png(svg, base + '.png', W)
    print('ok', i)
