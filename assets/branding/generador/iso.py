"""Geometria del isotipo Axhum Tech (A + estela), en el sistema de la imagen de referencia 1536x1024."""
import math

TURQ = '#18C4B8'
NAVY = '#0F172A'
WHITE = '#FFFFFF'

S = 0.57          # pendiente dx/dy de todas las patas
CX = 765          # eje de la A
HW = 105          # media anchura exterior a y=Y0
Y0 = 140
APEX_IN = 323     # vertice de la contraforma
GAP = 24          # separacion alrededor de la estela
BOTTOM = 917


def outer_left(y):
    return CX - HW - S * (y - Y0)


def outer_right(y):
    return CX + HW + S * (y - Y0)


def inner_left(y):
    return CX - S * (y - APEX_IN)


def inner_right(y):
    return CX + S * (y - APEX_IN)


def apex_arc():
    """Circulo tangente a las dos patas exteriores con techo en y=87."""
    n = math.hypot(1, S)
    top = 87
    # (HW + S*(yc-Y0))/n = yc - top
    yc = (HW - S * Y0 + n * top) / (n - S)
    r = yc - top
    nx, ny = 1 / n, S / n
    left = (CX - r * nx, yc - r * ny)
    right = (CX + r * nx, yc - r * ny)
    return left, right, r


SWOOSH = ('M1200 498 C900 506 420 582 211 917 L438 917 C600 730 850 612 1197 503 Z')

# Region "arriba de la estela" para recortar la parte superior de la A
ABOVE = ('M-50 -50 H1600 V475 L1063 475 C880 478 560 530 325 698 L-50 698 Z')


def upper_a():
    (lx, ly), (rx, ry), r = apex_arc()
    yb = 1000
    return (f'M{lx:.1f} {ly:.1f} A{r:.1f} {r:.1f} 0 0 1 {rx:.1f} {ry:.1f} '
            f'L{outer_right(yb):.1f} {yb} L{inner_right(yb):.1f} {yb} '
            f'L{CX} {APEX_IN} L{inner_left(yb):.1f} {yb} L{outer_left(yb):.1f} {yb} Z')


def lower_leg():
    """Pata derecha bajo la estela con el corte tipo rayo."""
    # el borde superior lo talla la mascara de la estela
    R = 78
    n = math.hypot(1, S)
    K = CX + HW - S * Y0
    yc = BOTTOM - R
    xc = K + S * yc - R * n
    tx, ty = xc + R / n, yc - R * S / n
    return (f'M938 648 L{outer_right(575):.1f} 575 '
            f'L{tx:.1f} {ty:.1f} A{R} {R} 0 0 1 {xc:.1f} {BOTTOM} '
            f'L1023 {BOTTOM} L811 726 L982 726 Z')


def mark_group(swoosh_color, a_color=TURQ, uid='a'):
    """Devuelve <defs> y cuerpo del isotipo en coordenadas de referencia."""
    defs = f'<clipPath id="{uid}c"><path d="{ABOVE}"/></clipPath>'
    body = (f'<path fill="{a_color}" clip-path="url(#{uid}c)" d="{upper_a()}"/>'
            f'<path fill="{a_color}" d="{lower_leg()}"/>'
            f'<path fill="{swoosh_color}" d="{SWOOSH}"/>')
    return defs, body


# caja util del isotipo (para encuadrar)
BOX = (205, 85, 1262, 920)
