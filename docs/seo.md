# SEO y posicionamiento de Axhum Tech

Actualizado: 2026-08-27. Modalidad confirmada por el titular: **100% remota**.
Mercado comunicado: Argentina. Marca: Axhum Tech. Web: https://axhumtech.com/.

## Estado y limites

- La web tiene paginas por servicio, metadatos, sitemap y datos estructurados.
- Se eliminaron las promesas de atencion presencial de Nosotros, Contacto y FAQ.
- La empresa se describe como `Organization`, no como un negocio local.
- Search Console: alta, verificacion y envio del sitemap **pendientes de confirmar**.
- Correo institucional: en configuracion; falta la direccion confirmada y operativa.
- No se han contratado anuncios, creado perfiles ni modificado DNS en este trabajo.
- La preparacion tecnica no demuestra indexacion ni garantiza posiciones en Google.

## Identidad comercial

Descripcion base para perfiles institucionales:

> Axhum Tech es una empresa argentina de desarrollo de software con atencion
> 100% remota. Creamos software a medida, paginas web, tiendas online,
> automatizaciones, CRM e integraciones para negocios y empresas. Tambien
> desarrollamos productos propios y acompanamos su implementacion y soporte.

La primera version funcional de un proyecto puede plantearse entre 2 y 8
semanas, dependiendo del alcance acordado y la complejidad. No presentar ese
rango como una garantia universal ni como plazo de resultados SEO.

No inventar oficinas, direcciones de atencion, clientes, testimonios ni resenas.
Mantener nombre, logo, dominio y telefono consistentes en los perfiles reales.
La procedencia geografica del fundador no implica una sede abierta al publico.

## Google Search Console: siguiente paso

Search Console permite comprobar indexacion y rendimiento; no es obligatorio
registrarse para aparecer en Google y no compra ni garantiza posicionamiento.

1. Iniciar sesion en https://search.google.com/search-console con una cuenta de
   Google controlada por el titular. No compartir contrasenas ni codigos de acceso.
2. Revisar si ya existe una propiedad para no duplicar trabajo. Si no, agregar
   una propiedad de tipo **Dominio** e introducir `axhumtech.com`, sin protocolo.
3. Copiar el registro TXT de verificacion que entregue Google. El valor real
   debe venir de esa cuenta; no inventarlo ni publicar uno de ejemplo.
4. En Cloudflare, zona `axhumtech.com`, DNS, agregar un registro **TXT** con
   nombre `@`, contenido `google-site-verification=...` y TTL automatico.
   Conservar los TXT existentes, MX, SPF, DKIM y DMARC del correo. No cambiar
   nameservers ni sustituir registros para esta verificacion.
5. Volver a Search Console y pulsar Verificar. Si el TXT todavia no se detecta,
   comprobar nombre/contenido y esperar propagacion. Conservarlo despues del alta.
6. En Sitemaps, enviar **https://axhumtech.com/sitemap.xml** y comprobar su estado.
7. En Inspeccion de URL, priorizar `/`, `/software-a-medida`, `/webs`,
   `/servicios` y `/nosotros`. Ejecutar la prueba en directo y solicitar
   indexacion si corresponde. Esto no garantiza inclusion ni un plazo.
8. Registrar fecha, propiedad verificada, estado del sitemap y problemas reales
   observados. No marcar este checklist como completado sin evidencia.

Alternativa si no hay acceso a DNS: propiedad de prefijo
`https://axhumtech.com/` con la etiqueta de verificacion real en el `head` de
`builds/preview/index.html`. Esta alternativa tiene una cobertura mas limitada.

El mail institucional sirve como contacto comercial, pero su configuracion no
verifica automaticamente Search Console. Su publicacion en la web puede hacerse
despues: confirmar direccion, probar envio/recepcion, agregar enlace de correo en
Contacto y actualizar el `email` de Organization de forma consistente.

## Google Business Profile / Maps: no aplica

Google excluye a las empresas exclusivamente online de Google Business Profile.
Axhum Tech no ofrece atencion presencial: **no crear una ficha**, tampoco con
direccion oculta, una oficina virtual o una zona de servicio ficticia.

El servicio de posicionamiento que Axhum Tech ofrece a otros negocios puede
incluir fichas para clientes que si cumplan los requisitos. Eso no vuelve elegible
a Axhum Tech. Solo reconsiderar si cambia realmente la modalidad de atencion y
se revisan nuevamente los requisitos de Google.

## Contenido y captacion: orden de trabajo propuesto

| Prioridad | Pagina / consulta objetivo | Contenido que debe demostrar |
| --- | --- | --- |
| Marca | `/`, `/nosotros`: Axhum Tech | Empresa real, mision, fundador, modalidad y contacto |
| Desarrollo | `/software-a-medida`: software a medida para empresas | Alcance, etapas, integraciones y ejemplos reales |
| Web | `/webs`: paginas web y tiendas online para empresas | Diseno, desarrollo, hosting, mantenimiento y entregables |
| Operacion | `/servicios`: CRM, automatizaciones, WhatsApp, SaaS | Problema que resuelve cada servicio y limites |
| Productos | `/productos`, `/gestion`, `/comanda`, `/arena` | Funciones y estado comercial real de cada producto |
| SEO | `/posicionamiento` | Metodo, medicion y diferencias entre SEO y Maps |
| Dudas | `/faq`, `/contacto` | Alcance, plazos, soporte remoto y como consultar |

Estas son prioridades editoriales, no un estudio de volumen de busqueda. Ajustar
con consultas e impresiones reales de Search Console cuando haya datos.

Trabajo inicial propuesto (no automatizado ni programado):

- Semana 1: verificar propiedad, enviar sitemap, corregir impedimentos de rastreo
  y completar el correo confirmado en el sitio.
- Semanas 2 a 4: documentar proyectos reales con permiso del cliente: necesidad,
  solucion, capturas autorizadas y resultado comprobable. Si es una demo, decirlo.
- Completar perfiles institucionales reales, como Instagram y LinkedIn, con el
  dominio oficial. Agregar a `sameAs` solo URLs que efectivamente pertenezcan a la marca.
- Despues de acumular datos: comparar periodos equivalentes en Search Console,
  separar consultas de marca de consultas de servicios y revisar paginas que
  reciben impresiones pero pocos clics. No fijar objetivos numericos sin una base.
- Para medir consultas comerciales, definir antes analitica y requisitos de
  privacidad. Un clic a WhatsApp no equivale a una venta ni a una consulta enviada.

## URLs y estructura tecnica

El HTML/CSS/JS editable vive en `builds/preview/`. `src/build-production.ps1`
genera `builds/production/`, copia assets y archivos publicos y transforma:

| Fuente | Produccion |
| --- | --- |
| `href="./index.html"` | `href="/"` |
| `href="./servicios.html"` | `href="/servicios"` |
| `href="./webs.html#tiendas"` | `href="/webs#tiendas"` |
| `https://axhumtech.com/gestion.html` | `https://axhumtech.com/gestion` |

Cloudflare Pages redirige las URLs `.html` a la forma limpia. Canonicals,
enlaces, JSON-LD y sitemap deben usar la URL final. No editar el build generado.

Cada pagina tiene titulo y descripcion propios, un `h1`, canonical, Open Graph
y Twitter Card. La 404 lleva `noindex`, no tiene canonical ni entra al sitemap.

Los datos estructurados usan `Organization`, `WebSite` y el tipo correspondiente
a cada pagina. La portada describe la oferta con `Service` y un canal online.
No usar `ProfessionalService` ni `LocalBusiness` para la empresa exclusivamente
remota. La informacion debe coincidir con lo visible. Los FAQ no garantizan
resultados enriquecidos ni un panel de empresa.

El JSON-LD usa UTF-8 real, nunca entidades HTML como `&aacute;`. Todas las copias
de Organization deben mantenerse consistentes. El build usa UTF-8 explicito.

- `public/sitemap.xml`: 12 paginas indexables. Agregar nuevas paginas aqui y
  actualizar `lastmod` solo tras cambios significativos, incluido el marcado.
- `public/robots.txt`: permite rastreo y declara el sitemap.
- `public/_headers`: seguridad y cache; el HTML se revalida.
- `public/_worker.js`: redireccion de otros hosts al dominio oficial.
- `.github/workflows/deploy-pages.yml`: build, validaciones y deploy a Pages.

## Validacion y rastreo

```powershell
./src/build-production.ps1
node --check builds/production/script.js
node src/validate-seo.mjs
node --test src/validate-seo.test.mjs
```

El validador comprueba titulos, canonical, indexabilidad, un `h1`, imagenes con
`alt`, JSON-LD, identidad remota consistente, sitemap, enlaces y anclas internas.
Corre antes de cada despliegue. No sustituye la inspeccion de Google.

Comprobar tambien el sitio publicado: respuestas 200 de las paginas, 404 real
para rutas inexistentes, redirecciones y ausencia de desafios para rastreadores.

Cloudflare agrega un bloque administrado al robots.txt publicado, distinto del
archivo fuente. El 2026-08-27 la respuesta observada permite el rastreo general y
no contiene un bloqueo especifico de Googlebot. No se modificaron esas reglas.
Revisar siempre la respuesta en vivo y Search Console: un HTTP 200 con un
user-agent simulado no demuestra que Google haya rastreado o indexado la pagina.
No deducir acceso de todos los buscadores a partir de la regla de un solo bot.

## Referencias oficiales

- Search Console: https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=es
- Elegibilidad de Maps: https://support.google.com/business/answer/13763036?hl=es
- Datos de empresa: https://developers.google.com/search/docs/appearance/structured-data/organization?hl=es
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Solicitudes de indexacion: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
