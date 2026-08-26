# SEO y posicionamiento

Estado al 2026-08-26. Este documento explica que quedo hecho, por que, y que hay
que hacer a mano fuera del repositorio.

## URLs

Cloudflare Pages responde `/pagina.html` con un **308 hacia `/pagina`**. Si el
sitio publicara enlaces con `.html`, cada enlace interno, cada `canonical` y cada
entrada del sitemap apuntaria a una redireccion.

Por eso el build reescribe las URLs:

| Fuente (`builds/preview/`) | Produccion (`builds/production/`) |
| --- | --- |
| `href="./index.html"` | `href="/"` |
| `href="./servicios.html"` | `href="/servicios"` |
| `href="./webs.html#tiendas"` | `href="/webs#tiendas"` |
| `https://axhumtech.com/gestion.html` | `https://axhumtech.com/gestion` |

En `builds/preview/` se conservan los `.html` porque ahi el sitio se abre
directamente desde el disco o con un servidor estatico simple. La reescritura
vive en `src/build-production.ps1`.

**Consecuencia:** `builds/production/` no se navega bien abriendo los archivos a
mano, porque sus enlaces son absolutos. Para mirar el sitio, usar
`builds/preview/`.

## Paginas y palabras clave

| Pagina | Intencion principal |
| --- | --- |
| `/` | Axhum Tech, software a medida, paginas web, posicionamiento |
| `/servicios` | Catalogo completo de servicios |
| `/software-a-medida` | Desarrollo de software a medida, sistemas de gestion |
| `/webs` | Diseno de paginas web, landings, tiendas online (`#tiendas`) |
| `/posicionamiento` | Posicionamiento en Google, SEO, ficha de Google Business Profile |
| `/productos` | Ecosistema de productos propios |
| `/gestion` | Sistema de gestion para comercios, facturacion ARCA |
| `/comanda` | Sistema de comandas para gastronomia |
| `/arena` | Software de gestion para gimnasios |
| `/faq` | Preguntas frecuentes (bloque de respuestas de Google) |
| `/nosotros` | Marca, criterio y fundador |
| `/contacto` | Conversion: WhatsApp y formulario |

Cada pagina tiene un solo `h1`, `title` propio, `meta description` de entre 70 y
180 caracteres, `canonical`, Open Graph y Twitter Card.

## Datos estructurados (JSON-LD)

Todas las paginas publican un `@graph` con:

- `Organization` (`#organizacion`) con telefono, localidad, `sameAs` y fundador.
- `WebSite` (`#sitio`).
- Un nodo propio de la pagina: `WebPage`, `Service`, `SoftwareApplication`,
  `CollectionPage`, `AboutPage` o `ContactPage` segun corresponda.
- `BreadcrumbList`, que ademas se muestra en pantalla con `.crumbs`.
- `FAQPage` en las paginas que tienen preguntas visibles. **El texto del JSON-LD
  y el texto visible tienen que decir lo mismo**: si se edita uno, editar el otro.

⚠️ Dentro de `<script type="application/ld+json">` las entidades HTML **no** se
decodifican: `&aacute;` se publicaria tal cual. Por eso el JSON-LD lleva acentos
en UTF-8 real, y `src/build-production.ps1` lee y escribe con UTF-8 explicito
(Windows PowerShell 5.1 usa ANSI por defecto y romperia los acentos).

## Archivos de indexacion

- `public/sitemap.xml`: las 12 paginas indexables con `lastmod`. La 404 no entra.
  **Al agregar una pagina hay que sumarla aca.**
- `public/robots.txt`: todo permitido, con el sitemap declarado.
- `builds/preview/404.html`: Cloudflare Pages la sirve con estado 404 real.
  Lleva `noindex` y no tiene `canonical`.

## Cabeceras

`public/_headers` fija `nosniff`, `Referrer-Policy`, `Permissions-Policy` y
`X-Frame-Options`, el HTML se revalida siempre y los estaticos se cachean.

## Verificacion

`node --check builds/production/script.js` ya corre en el flujo de despliegue.
Ademas conviene revisar a mano, despues de cada cambio grande:

1. Que el JSON-LD de cada pagina sea JSON valido y no tenga entidades HTML.
2. Que ningun enlace interno de `builds/production/` conserve `.html`.
3. Que cada `canonical` figure en el sitemap.
4. Que cada pagina tenga exactamente un `h1` y todas las imagenes tengan `alt`.

## Pendiente, fuera del repositorio

- Dar de alta el sitio en **Google Search Console** y enviar el sitemap.
- Configurar **analitica** (el sitio hoy no carga ningun script de medicion).
- Crear o reclamar la **ficha de Google Business Profile** de Axhum Tech. Es una
  empresa de servicio en el area: se verifica con una direccion, se la oculta y
  se declaran las zonas de cobertura.
- Completar `sameAs` de la `Organization` cuando existan mas perfiles publicos.
