# Idiomas de la web institucional

## Alcance

La web de Axhum Tech publica cuatro páginas en español, inglés, portugués
brasileño y francés. Las rutas equivalentes, textos comerciales, metadatos,
consentimiento de Analytics, formulario de contacto y avisos están traducidos.
La marca, nombres de productos, enlaces oficiales y datos de contacto no se
traducen.

| Idioma | Inicio | Servicios | Productos | Contacto |
| --- | --- | --- | --- | --- |
| ES | `/` | `/servicios` | `/productos` | `/contacto` |
| EN | `/en/` | `/en/services` | `/en/products` | `/en/contact` |
| PT-BR | `/pt/` | `/pt/servicos` | `/pt/produtos` | `/pt/contato` |
| FR | `/fr/` | `/fr/services` | `/fr/produits` | `/fr/contact` |

El selector de idioma apunta a la página equivalente. Se recuerda la elección
en el navegador. En la portada española puede mostrarse una sugerencia no
intrusiva según idioma del navegador o país aproximado que Cloudflare proporciona
en `/locale-hint`; no hay redirección automática ni almacenamiento de la IP.

## Límites honestos

`axhumgestion.com.ar` y `axenda.date` siguen en español y se aclara antes de
salir hacia esos dominios desde las páginas extranjeras. Los instaladores
Windows y sus releases oficiales tampoco se traducen desde esta web. ARCA es
una integración fiscal argentina, no una oferta fiscal global.

No se utiliza un widget de traducción automática: los textos son editables y
revisables. Para sumar otros idiomas completos, agregar contenido y rutas en
`src/site-copy.mjs`; el generador, selector, sitemap y validador usan ese
registro. Revisar el copy comercial con una persona que domine el mercado de
destino antes de campañas pagas.

## Mantenimiento y despliegue

- Contenido y rutas: `src/site-copy.mjs`.
- HTML, SEO y selector: `src/build-site.mjs`.
- Estilos: `src/site.css`.
- Formulario, preferencia y sugerencia: `src/site.js`.
- Consentimiento y tema: `builds/preview/analytics.js` y `theme.js`.
- Build y URLs públicas: `src/build-production.ps1` y `src/prepare-production.mjs`.
- País aproximado: `public/_worker.js`.
- Verificación: `node --test src/*.test.mjs` y `node src/validate-seo.mjs`.

La publicación se hace por el workflow de GitHub Actions al subir `main`.
