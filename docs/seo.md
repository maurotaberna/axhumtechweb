# SEO de la web institucional

Actualizado: 2026-09-29.

## URLs públicas

| Página | Objetivo de búsqueda |
| --- | --- |
| `/` | Axhum Tech, empresa de software y soluciones digitales |
| `/servicios` | Desarrollo de software, páginas web y automatizaciones |
| `/productos` | Axhum Gestión Online, Axenda y productos de escritorio |
| `/contacto` | Consulta comercial a Axhum Tech |

El sitemap incluye solo estas cuatro URLs. Las páginas anteriores se
redirigen con 301 en `public/_worker.js` hacia la nueva sección equivalente.
No se publican páginas duplicadas ni subpáginas de producto cuyo contenido
queda mejor en los sitios propios `axhumgestion.com.ar` y `axenda.date`.

## Reglas técnicas

- Cada página tiene título, descripción, canonical, Open Graph, un `h1` y
  JSON-LD de `Organization` y `WebPage`.
- La organización se describe sin dirección pública ni datos inventados.
- Los enlaces internos de producción usan URLs limpias; el preview usa `.html`.
- `robots.txt` apunta a `sitemap.xml`; `404.html` usa `noindex`.
- El build versiona CSS/JS para evitar una mezcla de HTML nuevo y caché vieja.
- `node src/validate-seo.mjs` y `node --test src/*.test.mjs` son obligatorios
  antes de publicar.

Después del despliegue, verificar en Search Console las cuatro páginas y
solicitar nueva indexación de la portada, Servicios y Productos. Comprobar
las redirecciones antiguas en el dominio real y actualizar campañas o perfiles
que aún enlacen a URLs anteriores.
