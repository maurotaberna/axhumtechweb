# Direccion visual y comercial

## Objetivo

La web debe presentar a Axhum Tech como una empresa tecnologica profesional, cercana y orientada a resultados de negocio. La estetica tiene que reforzar claridad, criterio y confianza.

## Referencia analizada

La web institucional de Snoop Consulting se uso como referencia de categoria, no como plantilla para copiar. Los patrones utiles son:

- Propuesta de valor visible desde el primer pantallazo.
- Navegacion institucional sobria.
- Servicios explicados por areas de impacto.
- Secciones de confianza: clientes, reconocimientos, testimonios y trayectoria.
- Cierre comercial directo y visible.

## Traduccion a Axhum Tech

- Tipografia editorial con jerarquias grandes y pocos efectos decorativos.
- Fondos marfil, blancos y petroleo claro; el azul noche se limita a texto y detalles.
- Grillas, lineas y composiciones geometricas en lugar de glassmorphism.
- Movimiento sobrio: entradas por scroll, marquesina tipografica, progreso de lectura y geometria ambiental lenta.
- Productos separados, con una propuesta especifica para cada uno.
- Metodo de trabajo explicito para reducir incertidumbre comercial.
- Mensajes concretos, sin afirmaciones, clientes o metricas no verificadas.

## Criterio de movimiento

- La animacion debe ayudar a recorrer y comprender la pagina.
- No se usan movimientos rapidos, rebotes ni efectos de cursor.
- Las interacciones principales responden con desplazamientos breves y cambios de color.
- El sitio respeta `prefers-reduced-motion` para accesibilidad.
- Si JavaScript no carga, el contenido permanece visible y utilizable.

## Sistema de pagina

1. Encabezado institucional.
2. Propuesta de valor y llamado a la accion.
3. Principios de trabajo.
4. Problemas y soluciones.
5. Productos propios.
6. Metodo de trabajo.
7. Presentacion de la empresa.
8. Contacto.
9. Pie institucional.

## Pendientes para produccion

- Definir casos reales, clientes autorizados y testimonios verificables.
- Confirmar correo, domicilio comercial, redes y horarios de contacto.
- Preparar capturas profesionales de Axhum Gestion y Axhum Comanda.
- Definir paginas internas y llamados a la accion de cada producto.
- Definir analitica y politica de privacidad para las consultas.

## Diagramas interactivos (2026-08-26)

Seis paginas de servicio y producto llevan un dibujo que explica su mecanismo:
`posicionamiento`, `webs`, `software-a-medida`, `gestion`, `comanda` y `arena`.
Van en una banda oscura (`section--dark`) justo debajo del hero, con el id
`como-funciona`.

Reglas del componente:

- **El texto largo no va adentro del SVG.** En el dibujo entran un rotulo corto
  y hasta dos lineas de etiqueta; la explicacion vive al costado, en HTML.
  Si el texto entra al SVG, deja de leerse cuando el dibujo se achica.
- **Cada caja tiene su nota.** `data-node="x"` en el `<g>` y `data-note="x"` en
  el bloque de texto. Si se agrega una caja hay que agregar su nota.
- **Cada conector declara a quien une**: `data-edge="origen destino"`. De ahi
  sale el resaltado del camino.
- **Sin JavaScript se ven todas las explicaciones** una debajo de la otra y el
  dibujo sigue siendo legible. Es la misma regla que rige al resto del sitio.
- **Se recorre con teclado**: cada caja es `tabindex="0"`, `role="button"` y
  tiene `aria-label`. El SVG lleva `<title>` con el resumen del diagrama.
- **En pantallas de menos de 700px** el dibujo se mantiene a 600px de ancho
  minimo y se desliza dentro de su caja. La pagina nunca scrollea en horizontal.

Los estilos son la seccion 21 de `styles.css` (`.diagram`, `.dg-*`) y la
interaccion es el ultimo bloque de `script.js`.

## Cerrado (2026-08-26)

- Tecnologia, hosting y dominio: HTML estatico en Cloudflare Pages, `axhumtech.com`.
- Formulario de contacto: arma un mensaje de WhatsApp, sin backend ni datos guardados.
- SEO tecnico completo: URLs limpias, datos estructurados, sitemap, 404 real y
  metadatos por pagina. Ver `docs/seo.md`.
- Paginas internas y llamados a la accion de cada servicio y cada producto.
