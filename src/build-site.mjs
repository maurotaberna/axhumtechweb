import { copyFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'builds/preview');
const origin = 'https://axhumtech.com';
const logo = '../../assets/branding/logos/';
const whatsapp = 'https://wa.me/543865267037?text=Hola%20Axhum%20Tech%2C%20quiero%20conversar%20sobre%20un%20proyecto.';

const organization = {
  '@type': 'Organization', '@id': `${origin}/#organizacion`, name: 'Axhum Tech',
  url: origin, logo: `${origin}/assets/branding/logos/axhum-tech-logo-on-light.svg`,
  description: 'Empresa de desarrollo de software y soluciones digitales. Trabajo remoto y puestas en marcha presenciales coordinadas según el proyecto.',
  email: 'hola@axhumtech.com', telephone: '+54 3865 267037',
};

function head(title, description, route) {
  const url = `${origin}${route}`;
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff"><meta name="robots" content="index, follow">
<title>${title}</title><meta name="description" content="${description}">
<link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Axhum Tech">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${origin}/assets/branding/social/axhum-tech-og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../public/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./theme.js"></script><link rel="stylesheet" href="./styles.css">
<script src="./analytics.js" defer></script><script src="./script.js" defer></script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, { '@type': 'WebPage', '@id': `${url}#pagina`, url, name: title, description }] })}</script>`;
}

function header(active) {
  const links = [['Inicio', './index.html'], ['Servicios', './servicios.html'], ['Productos', './productos.html'], ['Contacto', './contacto.html']];
  const nav = links.map(([label, href]) => `<a href="${href}"${label === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<a class="skip-link" href="#contenido">Ir al contenido</a><header class="site-header"><div class="shell header-inner">
<a class="brand" href="./index.html" aria-label="Axhum Tech, inicio"><img class="logo-light" src="${logo}axhum-tech-logo-on-light.svg" alt="Axhum Tech" width="178" height="52"><img class="logo-dark" src="${logo}axhum-tech-logo-on-dark.svg" alt="" width="178" height="52"></a>
<nav class="desktop-nav" aria-label="Navegación principal">${nav}</nav><div class="header-actions">
<button class="theme-toggle" type="button" data-theme-toggle aria-label="Modo oscuro" aria-pressed="false" title="Activar modo oscuro" hidden><span aria-hidden="true">◐</span></button>
<a class="header-contact" href="./contacto.html">Hablemos <span aria-hidden="true">↗</span></a>
<details class="mobile-menu"><summary aria-label="Abrir menú">Menú</summary><nav aria-label="Navegación móvil">${nav}</nav></details>
</div></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="shell footer-inner"><div><a href="./index.html" class="footer-brand">Axhum Tech</a><p>Desarrollamos soluciones digitales que hacen crecer tu negocio.</p></div>
<nav aria-label="Enlaces del pie"><a href="./servicios.html">Servicios</a><a href="./productos.html">Productos</a><a href="./contacto.html">Contacto</a></nav>
<div class="footer-contact"><a href="mailto:hola@axhumtech.com">hola@axhumtech.com</a><a href="https://wa.me/543865267037" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div></div>
<div class="shell footer-bottom"><span>© <span data-year>2026</span> Axhum Tech · Fundada por Mauro Gustavo Exequel Taberna</span><button type="button" data-consent-open>Preferencias de cookies</button></div></footer>`;
}

function page({ title, description, route, active, body }) {
  return `<!doctype html><html lang="es-AR"><head>${head(title, description, route)}</head><body>${header(active)}<main id="contenido">${body}</main>${footer()}</body></html>`;
}

const home = page({
  title: 'Axhum Tech | Desarrollo de software y soluciones digitales',
  description: 'Creamos software a medida, páginas web y automatizaciones para negocios. Conocé Axhum Gestión Online y Axenda.',
  route: '/', active: 'Inicio', body: `
<section class="hero-v2 shell"><div class="hero-topline"><span>AXHUM TECH / ESTUDIO DE SOFTWARE</span><span>ARGENTINA · TRABAJO REMOTO</span></div>
<div class="hero-stage"><div class="hero-copy"><p class="eyebrow">DESARROLLO DE SOFTWARE Y SOLUCIONES DIGITALES</p>
<h1>Software para negocios que <em>avanzan.</em></h1>
<p class="lead">Desarrollamos soluciones digitales que hacen crecer tu negocio. Software, webs y automatizaciones pensadas alrededor de una necesidad real.</p>
<div class="actions"><a class="button button-primary" href="./contacto.html">Hablemos de tu proyecto <span aria-hidden="true">↗</span></a><a class="text-link" href="./servicios.html">Explorar servicios <span aria-hidden="true">→</span></a></div></div>
<div class="hero-visual" aria-hidden="true"><div class="visual-head"><span>AXHUM / CAPACIDADES</span><span>01—03</span></div>
<div class="visual-orbit"><span class="orbit-node orbit-node-a">SOFTWARE</span><span class="orbit-node orbit-node-b">WEB</span><span class="orbit-node orbit-node-c">AUTOMATIZACIÓN</span><span class="orbit-core">Una idea.<br><b>Un sistema.</b></span></div>
<div class="visual-foot"><span>DEFINIR</span><i></i><span>DISEÑAR</span><i></i><span>CONSTRUIR</span></div></div></div>
<div class="hero-bottom"><span>ESTRATEGIA, DISEÑO Y DESARROLLO EN UNA MISMA DIRECCIÓN.</span><a href="#soluciones">Descubrí qué hacemos <span aria-hidden="true">↓</span></a></div></section>
<section class="section service-section" id="soluciones"><div class="shell"><div class="section-heading service-heading"><p class="eyebrow">QUÉ HACEMOS / 01</p><h2>De una idea a una herramienta que trabaja para vos.</h2><p>Elegimos la tecnología por lo que resuelve, no por cómo suena.</p></div>
<div class="service-list"><a href="./servicios.html#software"><span class="list-index">01 / DESARROLLO</span><strong>Software a medida</strong><span>Sistemas, plataformas y herramientas para la operación real de tu negocio.</span><b aria-hidden="true">↗</b><span class="service-symbol service-symbol-code" aria-hidden="true"><i></i><i></i><i></i></span></a>
<a href="./servicios.html#webs"><span class="list-index">02 / PRESENCIA</span><strong>Webs y tiendas</strong><span>Una experiencia digital que presenta, conecta y vende.</span><b aria-hidden="true">↗</b><span class="service-symbol service-symbol-web" aria-hidden="true"><i></i><i></i></span></a>
<a href="./servicios.html#automatizaciones"><span class="list-index">03 / PROCESOS</span><strong>Automatizaciones</strong><span>Menos tareas repetitivas. Más tiempo para lo que importa.</span><b aria-hidden="true">↗</b><span class="service-symbol service-symbol-flow" aria-hidden="true"><i></i><i></i><i></i></span></a></div></div></section>
<section class="section shell product-section" id="productos"><div class="section-heading split"><div><p class="eyebrow">PRODUCTOS EN LÍNEA / 02</p><h2>No solo lo imaginamos.<br>También lo construimos.</h2></div><p>Dos productos propios disponibles para conocer hoy. Una muestra concreta de nuestra forma de desarrollar.</p></div>
<div class="product-grid"><article class="product-teaser"><div class="product-top"><span class="product-kicker">GESTIÓN COMERCIAL / EN LÍNEA</span><span class="product-number" aria-hidden="true">01</span></div><div class="product-identity"><span class="product-line" aria-hidden="true"></span><h3>Axhum<br>Gestión Online</h3></div><p>Una plataforma para ordenar ventas, productos y la operación diaria del comercio.</p><a href="https://axhumgestion.com.ar/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axhum Gestión Online">Conocer Gestión Online <span aria-hidden="true">↗</span></a><span class="product-domain">axhumgestion.com.ar</span></article>
<article class="product-teaser"><div class="product-top"><span class="product-kicker">TURNOS Y RESERVAS / EN LÍNEA</span><span class="product-number" aria-hidden="true">02</span></div><div class="product-identity"><span class="product-line" aria-hidden="true"></span><h3>Axenda</h3></div><p>Tu página de reservas y agenda online, pensada para que tus clientes encuentren un turno.</p><a href="https://axenda.date/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axenda">Conocer Axenda <span aria-hidden="true">↗</span></a><span class="product-domain">axenda.date</span></article></div>
<a class="product-all-link" href="./productos.html">Explorar todos los productos <span aria-hidden="true">↗</span></a></section>
<section class="section company-section" id="empresa"><div class="shell closing-grid"><div><p class="eyebrow">LA EMPRESA / 03</p><h2>La tecnología tiene que sentirse <em>hecha para tu negocio.</em></h2></div><div><p>Axhum Tech fue fundada por Mauro Gustavo Exequel Taberna. Desarrollamos de forma remota y coordinamos puestas en marcha presenciales cuando el proyecto lo requiere.</p><a class="button button-light" href="./contacto.html">Empecemos una conversación <span aria-hidden="true">↗</span></a></div></div></section>`
});

const services = page({
  title: 'Servicios de desarrollo de software y páginas web | Axhum Tech',
  description: 'Software a medida, páginas web, tiendas online y automatizaciones para empresas y negocios. Definimos cada proyecto según su alcance.',
  route: '/servicios', active: 'Servicios', body: `
<section class="page-intro shell" data-index="01"><p class="eyebrow">SERVICIOS / AXHUM TECH</p><h1>Lo que tu negocio necesita, <em>sin soluciones de molde.</em></h1><p class="lead">Nos contás el problema. Elegimos el formato adecuado y acordamos una entrega concreta antes de empezar.</p><a class="button button-primary" href="./contacto.html">Pedir una propuesta <span aria-hidden="true">↗</span></a></section>
<section class="section soft" id="webs"><div class="shell two-column"><div><p class="eyebrow">01 / PRESENCIA DIGITAL</p><h2>Webs para que te encuentren y te elijan.</h2><p>Diseño, desarrollo y puesta online según el objetivo de tu negocio. Dominio, hosting y mantenimiento se definen en la propuesta.</p></div>
<div class="offer-list"><div><strong>Landing page</strong><span>Una propuesta clara y un camino directo a la consulta. Desde USD 100.</span></div><div><strong>Web y catálogo</strong><span>Más espacio para presentar servicios, productos o tu empresa.</span></div><div><strong>Tienda online</strong><span>Una experiencia de compra adaptada a tus pedidos, pagos y entregas.</span></div><a class="text-link" href="./contacto.html?interes=web">Quiero una web <span aria-hidden="true">→</span></a></div></div></section>
<section class="section shell two-column" id="software"><div><p class="eyebrow">02 / DESARROLLO</p><h2>Software que se adapta a tu operación.</h2></div><div><p>Sistemas internos, CRM, plataformas, aplicaciones e integraciones. Construimos alrededor del proceso real, no al revés.</p><p>Con un alcance inicial definido, una primera versión funcional puede plantearse entre 2 y 8 semanas, según complejidad.</p><a class="text-link" href="./contacto.html?interes=software">Hablemos de software <span aria-hidden="true">→</span></a></div></section>
<section class="section line-top shell two-column" id="automatizaciones"><div><p class="eyebrow">03 / PROCESOS</p><h2>Menos tareas repetidas. Más tiempo para tu negocio.</h2></div><div><p>Automatizaciones, flujos de WhatsApp e integraciones entre herramientas. Primero detectamos dónde se pierde tiempo; después definimos qué conviene automatizar.</p><a class="text-link" href="./contacto.html?interes=automatizacion">Consultar una automatización <span aria-hidden="true">→</span></a></div></section>
<section class="section dark-section"><div class="shell closing-grid"><div><p class="eyebrow">CÓMO EMPEZAMOS</p><h2>Una conversación antes que una cotización genérica.</h2></div><div><p>Nos explicás qué querés lograr. Te devolvemos una propuesta con alcance, entregables y costos claros.</p><a class="button button-light" href="./contacto.html">Contanos tu proyecto <span aria-hidden="true">↗</span></a></div></div></section>`
});

const products = page({
  title: 'Productos de Axhum Tech | Gestión Online, Axenda y escritorio',
  description: 'Conocé Axhum Gestión Online y Axenda, dos productos listos para probar. También ofrecemos soluciones de escritorio para comercios, gastronomía y talleres.',
  route: '/productos', active: 'Productos', body: `
<section class="page-intro shell" data-index="02"><p class="eyebrow">PRODUCTOS / AXHUM TECH</p><h1>Productos listos para <em>empezar.</em></h1><p class="lead">Dos soluciones online con su propio sitio y prueba de 15 días. Si necesitás algo diferente, también desarrollamos a medida.</p></section>
<section class="section shell featured-products"><article class="featured-product" id="gestion-online"><div><span class="product-kicker">01 / COMERCIOS</span><h2>Axhum Gestión Online</h2><p>Gestión comercial para acompañar el día a día de tu negocio desde una plataforma web.</p><span class="product-note">Prueba de 15 días · Planes y condiciones en su sitio</span></div><a class="button button-outline" href="https://axhumgestion.com.ar/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axhum Gestión Online">Explorar producto <span aria-hidden="true">↗</span></a></article>
<article class="featured-product" id="axenda"><div><span class="product-kicker">02 / RESERVAS</span><h2>Axenda</h2><p>Una página de reservas y agenda online para que tus clientes encuentren el momento adecuado.</p><span class="product-note">Prueba de 15 días · Alta en su sitio</span></div><a class="button button-outline" href="https://axenda.date/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axenda">Explorar producto <span aria-hidden="true">↗</span></a></article></section>
<section class="section soft" id="escritorio"><div class="shell two-column"><div><p class="eyebrow">TAMBIÉN EN ESCRITORIO</p><h2>Herramientas para trabajar en tu local.</h2><p>Si preferís una solución instalada en Windows, podemos ayudarte a elegir la edición adecuada.</p></div><div class="desktop-list"><div><strong>Axhum Gestión</strong><span>Gestión comercial; edición común y edición con ARCA.</span></div><div><strong>Axhum Comanda</strong><span>Operación diaria para gastronomía.</span></div><div><strong>Axhum Service</strong><span>Órdenes y seguimiento para talleres de celulares.</span></div><div><strong>Axhum Distribuidora</strong><span>Gestión de operación mayorista, con implementación coordinada.</span></div><details class="downloads"><summary>Ver descargas y versiones oficiales <span aria-hidden="true">+</span></summary><div class="downloads-content">
<p>Instaladores para Windows. Las ediciones descargables incluyen 15 días de prueba. Podés consultar los detalles de cada versión en su release oficial.</p>
<ul><li><a href="https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.0.9" target="_blank" rel="noopener noreferrer">Axhum Gestión 1.0.9 · ver release</a> <a href="https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.0.9/Axhum.Gestion-Setup-1.0.9.exe" data-track="download_clicked" data-track-product="Axhum Gestión 1.0.9">Descargar ↗</a></li>
<li><a href="https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.0.9" target="_blank" rel="noopener noreferrer">Axhum Gestión + ARCA 1.0.9 · ver release</a> <a href="https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.0.9/Axhum.Gestion.%2B.ARCA-Setup-1.0.9.exe" data-track="download_clicked" data-track-product="Axhum Gestión + ARCA 1.0.9">Descargar ↗</a></li>
<li><a href="https://github.com/maurotaberna/AxhumComanda-releases/releases/tag/v1.0.1" target="_blank" rel="noopener noreferrer">Axhum Comanda 1.0.1 · ver release</a> <a href="https://github.com/maurotaberna/AxhumComanda-releases/releases/download/v1.0.1/Axhum.Comanda-Setup-1.0.1.exe" data-track="download_clicked" data-track-product="Axhum Comanda 1.0.1">Descargar ↗</a></li>
<li><a href="https://github.com/maurotaberna/AxhumService-releases/releases/tag/v1.0.1" target="_blank" rel="noopener noreferrer">Axhum Service 1.0.1 · ver release</a> <a href="https://github.com/maurotaberna/AxhumService-releases/releases/download/v1.0.1/Axhum.Service-Setup-1.0.1.exe" data-track="download_clicked" data-track-product="Axhum Service 1.0.1">Descargar ↗</a></li></ul>
<p class="small-note">Los instaladores aún no tienen firma digital comercial. Windows puede mostrar “Editor desconocido” (SmartScreen); verificá que la descarga provenga del release oficial. Si decidís continuar: “Más información” → “Ejecutar de todas formas”. No desactives el antivirus ni otros controles de seguridad.</p>
</div></details></div></div></section>
<section class="section shell compact-cta"><h2>¿Tu negocio necesita algo distinto?</h2><a class="button button-primary" href="./contacto.html">Hablemos de una solución a medida <span aria-hidden="true">↗</span></a></section>`
});

const contact = page({
  title: 'Contacto y proyectos | Axhum Tech',
  description: 'Contanos qué necesita tu negocio. Consultá por desarrollo de software, una web, una automatización o los productos de Axhum Tech.',
  route: '/contacto', active: 'Contacto', body: `
<section class="page-intro shell" data-index="03"><p class="eyebrow">CONTACTO / AXHUM TECH</p><h1>Contanos la idea. <em>Vemos cómo hacerla realidad.</em></h1><p class="lead">No hace falta que tengas una especificación técnica. Con saber qué problema querés resolver, podemos empezar.</p></section>
<section class="section shell contact-grid"><div><h2>Escribinos directo.</h2><p>Respondemos normalmente entre 10 minutos y 48 horas. Trabajamos en remoto y coordinamos visitas o instalaciones cuando corresponde.</p><a class="contact-method" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_clicked">WhatsApp <span>+54 3865 267037 ↗</span></a><a class="contact-method" href="mailto:hola@axhumtech.com" data-track="email_clicked">Correo <span>hola@axhumtech.com ↗</span></a></div>
<form class="brief-form" data-brief-form><h2>O prepará tu consulta.</h2><p>Se abrirá WhatsApp con el mensaje para que lo revises y envíes. No guardamos estos datos en la web.</p>
<label>Tu nombre <input name="nombre" autocomplete="name" required maxlength="80"></label><label>Negocio o rubro <input name="negocio" required maxlength="100"></label>
<label>¿Qué necesitás? <select name="interes" required><option value="">Elegí una opción</option><option value="Una página web">Una página web</option><option value="Software a medida">Software a medida</option><option value="Una automatización">Una automatización</option><option value="Axhum Gestión Online">Axhum Gestión Online</option><option value="Axenda">Axenda</option><option value="Otro proyecto">Otro proyecto</option></select></label>
<label>Contanos brevemente <textarea name="detalle" rows="4" required maxlength="1200" placeholder="¿Qué querés resolver?"></textarea></label><button class="button button-primary" type="submit">Preparar mensaje <span aria-hidden="true">↗</span></button><p class="form-status" data-form-status role="status" hidden></p></form></section>`
});

const notFound = `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="noindex, follow"><title>Página no encontrada | Axhum Tech</title><meta name="description" content="Esta página ya no está disponible. Volvé al inicio o consultá los servicios de Axhum Tech."><script src="./theme.js"></script><link rel="stylesheet" href="./styles.css"><script src="./analytics.js" defer></script><script src="./script.js" defer></script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Página no encontrada' })}</script></head><body>${header('')}<main id="contenido"><section class="page-intro shell"><p class="eyebrow">ERROR 404</p><h1>Esta página ya no está acá.</h1><p class="lead">Simplificamos el sitio. Podés empezar por el inicio o contarnos qué buscabas.</p><div class="actions"><a class="button button-primary" href="./index.html">Ir al inicio</a><a class="text-link" href="./contacto.html">Contactar</a></div></section></main>${footer()}</body></html>`;

for (const [name, html] of Object.entries({ 'index.html': home, 'servicios.html': services, 'productos.html': products, 'contacto.html': contact, '404.html': notFound })) {
  writeFileSync(join(output, name), html, 'utf8');
}
copyFileSync(join(root, 'src/site.css'), join(output, 'styles.css'));
copyFileSync(join(root, 'src/site.js'), join(output, 'script.js'));
console.log('Vista previa generada: 4 páginas y 404.');
