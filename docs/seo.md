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

## Alta en Google, paso a paso

Son **dos altas distintas** y conviene no confundirlas. Para una empresa sin
local a la calle, la que de verdad importa es la primera.

### 1. Google Search Console (obligatoria, no depende de tener local)

Es lo que hace que Google entienda, indexe y rankee el sitio. No pregunta por
direccion ni por local. Es gratis. Sin esto, el resto no sirve de mucho.

1. Entrar a `search.google.com/search-console` con la cuenta de Google de la
   empresa (no una personal que despues no se pueda transferir).
2. Elegir el tipo de propiedad **Dominio**, no "Prefijo de URL". La de dominio
   cubre `axhumtech.com`, `www`, subdominios y http/https de una sola vez.
3. Google devuelve un registro `TXT` del estilo
   `google-site-verification=xxxxxxxx`.
4. Cargarlo en Cloudflare: panel de `axhumtech.com` -> DNS -> Add record ->
   Type `TXT`, Name `@`, Content el valor que dio Google. Guardar.
5. Esperar unos minutos y darle **Verificar**.
6. Ya dentro: **Sitemaps** -> agregar `sitemap.xml`.
7. **Inspeccion de URL** -> pegar `https://axhumtech.com/` -> "Solicitar
   indexacion". Repetir con las paginas de servicio. Hay cupo diario, asi que
   conviene priorizar `/`, `/posicionamiento`, `/webs` y `/software-a-medida`.

Si por algun motivo no se puede tocar el DNS, la alternativa es la propiedad de
tipo "Prefijo de URL" con la etiqueta `<meta name="google-site-verification">`
en el `<head>`. En ese caso hay que sumarla a las 13 paginas de
`builds/preview/`, o al menos a `index.html`.

### 2. Google Business Profile (la ficha de Maps): se puede, con una condicion

Se puede tener ficha **sin local a la calle**, como *empresa de servicio a
domicilio* (service-area business): se carga una direccion real solo para
verificar, se la **oculta** y se declaran las zonas de cobertura.

⚠️ **La condicion excluyente:** Google exige que el negocio tenga contacto
presencial con los clientes. Una empresa 100% remota no califica y la ficha se
puede suspender. Axhum si califica por la instalacion, la capacitacion y el
soporte presencial de Gestion y Comanda; la ficha tiene que describir *ese*
servicio local, no el desarrollo remoto.

Pasos:

1. `business.google.com` -> agregar empresa.
2. Nombre **exactamente** "Axhum Tech", igual que en el sitio y en el JSON-LD.
   El nombre, el telefono y la web tienen que coincidir en todos lados.
3. Categoria principal: desarrollador de software. Secundarias: diseñador de
   sitios web, consultor de marketing.
4. Cuando pregunta si los clientes pueden visitar la direccion: **No**.
5. Cargar las zonas de cobertura (hasta 20; el limite razonable es unas 2 horas
   de manejo desde la base): Concepcion, Aguilares, Monteros, San Miguel de
   Tucuman y alrededores.
6. Verificacion: hoy suele ser por video. Hay que mostrar la zona, el lugar de
   trabajo y algo que pruebe que la empresa opera ahi.
7. Completar telefono `+54 3865 267037`, web `https://axhumtech.com`, horarios,
   servicios, descripcion y fotos reales.
8. Pedir reseñas a clientes reales. No se compran ni se inventan.

No sirven: casilla de correo, oficina virtual ni una direccion prestada.

### 3. Bing Webmaster Tools (opcional, cuesta cinco minutos)

`bing.com/webmasters` permite importar todo desde Search Console con un clic.
Alimenta a Bing y a Copilot.

## El robots.txt en vivo no es el del repositorio

Cloudflare **inyecta un bloque propio arriba** del `public/robots.txt`. Se ve
con `curl -s https://axhumtech.com/robots.txt`. Ese bloque:

- Deja pasar a Googlebot y declara `Content-Signal: search=yes`. **La busqueda
  normal de Google no esta afectada.**
- Bloquea `Google-Extended`, que solo controla el entrenamiento y el grounding
  de Gemini. Segun la documentacion de Google, esto **no** afecta el ranking ni
  la aparicion en AI Overviews.
- Bloquea `GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, `Applebot-Extended`,
  `meta-externalagent` y `Amazonbot`. Consecuencia real: Axhum Tech **no puede
  ser citada en las respuestas de ChatGPT, Claude ni Perplexity**.

**El bloqueo es solo por robots.txt, no por HTTP.** Verificado el 2026-08-27
pidiendo la portada y el sitemap con el user-agent de cada rastreador: Googlebot,
Bingbot, GPTBot, ClaudeBot y PerplexityBot reciben **200**, ninguno recibe 403.
Es decir, no hay regla de firewall bloqueando; lo que hay es una directiva que
los bots seros respetan por su cuenta. El efecto practico es el mismo para los
que obedecen, pero el sitio no esta "caido" para nadie.

Para repetir la comprobacion:

    curl -s -o /dev/null -w "%{http_code}
"       -A "Mozilla/5.0 (compatible; GPTBot/1.1; +https://openai.com/gptbot)"       https://axhumtech.com/

Se cambia en el panel de Cloudflare, en el control de rastreadores de IA, que
tiene tres categorias: **Search**, **Agent** y **Training**. Para que los
asistentes puedan citar al sitio hay que permitir **Agent**.

⚠️ **No usar el bloqueo de Training a la ligera.** Cloudflare clasifica a
Googlebot y a Bingbot como rastreadores de proposito mixto (busqueda +
entrenamiento) y los trata con la regla mas restrictiva. Bloquear Training
—incluida la opcion vieja "Block AI bots"— puede terminar bloqueando a
Googlebot, que es exactamente lo contrario de lo que busca este sitio. Desde el
2026-09-15 rigen defaults nuevos con ese criterio.

Para una empresa que vende posicionamiento, aparecer en asistentes de IA suele
convenir mas que proteger el contenido de la portada.

## Pendiente, fuera del repositorio

- Dar de alta el sitio en Google Search Console y enviar el sitemap (arriba).
- Crear la ficha de Google Business Profile (arriba).
- Decidir que hacer con el bloqueo de rastreadores de IA de Cloudflare (arriba).
- Configurar **analitica**: el sitio hoy no carga ningun script de medicion.
- Completar `sameAs` de la `Organization` cuando existan mas perfiles publicos.
