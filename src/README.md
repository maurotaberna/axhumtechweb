# Implementación

- `build-site.mjs`: fuente editable de las cuatro páginas, cabecera, pie y SEO.
- `site.css`: sistema visual claro/oscuro y responsive.
- `site.js`: eventos de medición y formulario breve hacia WhatsApp.
- `build-production.ps1`: genera preview y producción, copia assets, normaliza
  URLs y versiona CSS/JS.
- `validate-seo.mjs` y `*.test.mjs`: validación de contenido técnico,
  redirecciones y descargas.

No editar HTML, CSS ni `script.js` generados en `builds/preview/`; serán
sobrescritos por el próximo build. `theme.js` y `analytics.js` son las dos
excepciones editables de esa carpeta por compatibilidad con el despliegue
actual.
