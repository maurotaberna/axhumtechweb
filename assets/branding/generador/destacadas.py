"""Portadas de destacadas de Instagram (1080x1080). Uso: python -I destacadas.py <py_libs> <repo>"""
import sys, os
sys.path.insert(0, sys.argv[1])
import resvg_py

REPO = sys.argv[2]
OUT = os.path.join(REPO, 'assets/branding/social/instagram/destacadas')
NAVY, TURQ = '#0F172A', '#18C4B8'
W = 1080
SW = 34  # grosor de linea

ICONS = {
    # monitor con grafico de barras ascendente
    'gestion': f'''
      <rect x="290" y="330" width="500" height="330" rx="34"/>
      <path d="M470 760 H610 M540 660 V760"/>
      <path d="M385 585 V540 M465 585 V495 M545 585 V520 M625 585 V470" stroke-width="{SW + 8}"/>
      <path d="M370 480 L465 425 L545 452 L700 400" stroke-width="{SW - 6}"/>
      <circle cx="700" cy="400" r="14" fill="{TURQ}" stroke="none"/>''',
    # estrella de valoracion dentro de un globo de dialogo
    'referencias': f'''
      <path d="M330 340 H750 Q790 340 790 380 V620 Q790 660 750 660 H520 L420 750 V660 H330 Q290 660 290 620 V380 Q290 340 330 340 Z"/>
      <path d="M540 405 L571 468 L640 478 L590 527 L602 596 L540 563 L478 596 L490 527 L440 478 L509 468 Z" fill="{TURQ}" stroke-width="10"/>''',
    # ventana de navegador con bloques de pagina
    'paginas-web': f'''
      <rect x="280" y="320" width="520" height="440" rx="34"/>
      <path d="M280 420 H800"/>
      <circle cx="340" cy="370" r="12" fill="{TURQ}" stroke="none"/>
      <circle cx="385" cy="370" r="12" fill="{TURQ}" stroke="none"/>
      <circle cx="430" cy="370" r="12" fill="{TURQ}" stroke="none"/>
      <rect x="345" y="480" width="180" height="210" rx="16"/>
      <path d="M580 500 H735 M580 570 H735 M580 640 H690"/>''',
}


def cover(name, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {W}" width="{W}" height="{W}">'
            f'<title>Axhum Tech - destacada {name}</title>'
            '<defs><radialGradient id="g" cx="1" cy="1" r="1.05">'
            '<stop offset="0" stop-color="#18C4B8" stop-opacity=".38"/>'
            '<stop offset=".6" stop-color="#18C4B8" stop-opacity="0"/></radialGradient></defs>'
            f'<rect width="{W}" height="{W}" fill="{NAVY}"/><rect width="{W}" height="{W}" fill="url(#g)"/>'
            f'<g fill="none" stroke="{TURQ}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{body}</g>'
            '</svg>\n')


os.makedirs(OUT, exist_ok=True)
for name, body in ICONS.items():
    svg = cover(name, body)
    open(os.path.join(OUT, f'destacada-{name}.svg'), 'w', encoding='utf-8', newline='\n').write(svg)
    open(os.path.join(OUT, f'destacada-{name}.png'), 'wb').write(bytes(resvg_py.svg_to_bytes(svg_string=svg, width=W)))
    print(name)
