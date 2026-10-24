import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { copy, locales, pageKeys, previewHref, routeFor } from './site-copy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'builds/preview');
const origin = 'https://axhumtech.com';
const founder = 'Mauro Gustavo Exequiel Taberna';
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const h = escapeHtml;
const link = (locale, page, hash = '') => `${previewHref(locale, locale, page)}${hash}`;
const assets = (locale) => locale === 'es' ? '../../assets/' : '../../../assets/';
const sharedFiles = (locale) => locale === 'es' ? './' : '../';

const desktopProducts = ['Axhum Gestión', 'Axhum Comanda', 'Axhum Service', 'Axhum Distribuidora'];
const releases = [
  { name: 'Axhum Gestión', version: '1.1.1', repository: 'AxhumGestion-releases', file: 'Axhum.Gestion-Setup-1.1.1.exe' },
  { name: 'Axhum Gestión + ARCA', version: '1.1.1', repository: 'AxhumGestion-releases', file: 'Axhum.Gestion.%2B.ARCA-Setup-1.1.1.exe' },
  { name: 'Axhum Comanda', version: '1.0.1', repository: 'AxhumComanda-releases', file: 'Axhum.Comanda-Setup-1.0.1.exe' },
  { name: 'Axhum Service', version: '1.0.1', repository: 'AxhumService-releases', file: 'Axhum.Service-Setup-1.0.1.exe' },
];

function languageLinks(locale, page) {
  return Object.entries(locales).map(([key, spec]) => {
    const current = key === locale ? ' aria-current="page"' : '';
    return `<a href="${previewHref(locale, key, page)}" lang="${spec.tag}" hreflang="${spec.tag}" data-locale-choice="${key}"${current}>${h(spec.label)}</a>`;
  }).join('');
}

function head(locale, page, title, description) {
  const url = `${origin}${routeFor(locale, page)}`;
  const spec = locales[locale];
  const prefix = sharedFiles(locale);
  const alt = pageKeys.includes(page) ? Object.entries(locales).map(([key, value]) =>
    `<link rel="alternate" hreflang="${value.tag}" href="${origin}${routeFor(key, page)}">`).join('') +
    `<link rel="alternate" hreflang="x-default" href="${origin}${routeFor('es', page)}">` : '';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': origin + '/#organizacion', name: 'Axhum Tech', url: origin,
        logo: origin + '/assets/branding/logos/axhum-tech-logo-on-light.svg',
        description: copy[locale].shared.organization, email: 'hola@axhumtech.com', telephone: '+54 3865 267037' },
      { '@type': 'WebPage', '@id': `${url}#pagina`, url, name: title, description, inLanguage: spec.tag },
    ],
  };
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff"><meta name="robots" content="index, follow">
<title>${h(title)}</title><meta name="description" content="${h(description)}">
<link rel="canonical" href="${url}">${alt}<meta property="og:type" content="website"><meta property="og:site_name" content="Axhum Tech">
<meta property="og:locale" content="${spec.tag}"><meta property="og:title" content="${h(title)}"><meta property="og:description" content="${h(description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${origin}/assets/branding/social/axhum-tech-og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${locale === 'es' ? '../../public/' : '../../../public/'}favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="${prefix}theme.js"></script><link rel="stylesheet" href="${prefix}styles.css">
<script src="${prefix}analytics.js" defer></script><script src="${prefix}script.js" defer></script>
<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function header(locale, page) {
  const shared = copy[locale].shared;
  const nav = pageKeys.map((key, index) =>
    `<a href="${link(locale, key)}"${key === page ? ' aria-current="page"' : ''}>${h(shared.nav[index])}</a>`).join('');
  return `<a class="skip-link" href="#contenido">${h(shared.skip)}</a><header class="site-header"><div class="shell header-inner">
<a class="brand" href="${link(locale, 'home')}" aria-label="Axhum Tech"><img class="logo-light" src="${assets(locale)}branding/logos/axhum-tech-logo-on-light.svg" alt="Axhum Tech" width="178" height="52"><img class="logo-dark" src="${assets(locale)}branding/logos/axhum-tech-logo-on-dark.svg" alt="" width="178" height="52"></a>
<nav class="desktop-nav" aria-label="${h(shared.nav[0])}">${nav}</nav><div class="header-actions">
<details class="language-menu"><summary aria-label="${h(shared.language)}">${locales[locale].code}</summary><div class="language-options">${languageLinks(locale, page)}</div></details>
<button class="theme-toggle" type="button" data-theme-toggle aria-label="${h(shared.theme)}" aria-pressed="false" hidden><span aria-hidden="true">◐</span></button>
<a class="header-contact" href="${link(locale, 'contact')}">${h(shared.talk)} <span aria-hidden="true">↗</span></a>
<details class="mobile-menu"><summary aria-label="${h(shared.nav[0])}">${h(locale === 'es' ? 'Menú' : 'Menu')}</summary><nav aria-label="${h(shared.nav[0])}">${nav}</nav></details>
</div></div></header>`;
}

function footer(locale) {
  const shared = copy[locale].shared;
  return `<footer class="site-footer"><div class="shell footer-inner"><div><a href="${link(locale, 'home')}" class="footer-brand">Axhum Tech</a><p>${h(shared.tagline)}</p></div>
<nav aria-label="${h(shared.nav[3])}"><a href="${link(locale, 'services')}">${h(shared.nav[1])}</a><a href="${link(locale, 'products')}">${h(shared.nav[2])}</a><a href="${link(locale, 'contact')}">${h(shared.nav[3])}</a></nav>
<div class="footer-contact"><a href="mailto:hola@axhumtech.com">hola@axhumtech.com</a><a href="https://wa.me/543865267037" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div></div>
<div class="shell footer-bottom"><span>© <span data-year>2026</span> Axhum Tech · ${h(shared.founded)} ${founder}</span><button type="button" data-consent-open>${h(shared.cookiePrefs)}</button></div></footer>`;
}

function page(locale, key, body) {
  const content = copy[locale][key];
  const hint = locale === 'es' && key === 'home' ? '<aside class="language-hint" data-language-hint hidden></aside>' : '';
  return `<!doctype html><html lang="${locales[locale].tag}"><head>${head(locale, key, content.title, content.description)}</head><body>${header(locale, key)}${hint}<main id="contenido">${body}</main>${footer(locale)}</body></html>`;
}

function home(locale) {
  const c = copy[locale].home;
  const serviceCards = c.serviceCards.map(([eyebrow, title, description, anchor], index) =>
    `<a href="${link(locale, 'services', '#' + anchor)}"><span class="list-index">${h(eyebrow)}</span><strong>${h(title)}</strong><span>${h(description)}</span><b aria-hidden="true">↗</b><span class="service-symbol service-symbol-${['code', 'web', 'flow'][index]}" aria-hidden="true">${Array.from({ length: index === 2 ? 3 : index === 0 ? 3 : 2 }, () => '<i></i>').join('')}</span></a>`).join('');
  return page(locale, 'home', `
<section class="hero-v2 shell"><div class="hero-topline"><span>${h(c.topline)}</span><span>${h(c.location)}</span></div>
<div class="hero-stage"><div class="hero-copy"><p class="eyebrow">${h(c.eyebrow)}</p><h1>${h(c.headline)} <em>${h(c.accent)}</em></h1>
<p class="lead">${h(c.lead)}</p><div class="actions"><a class="button button-primary" href="${link(locale, 'contact')}">${h(c.primary)} <span aria-hidden="true">↗</span></a><a class="text-link" href="${link(locale, 'services')}">${h(c.secondary)} <span aria-hidden="true">→</span></a></div></div>
<div class="hero-visual" aria-hidden="true"><div class="visual-head"><span>${h(c.visualHead)}</span><span>01—03</span></div>
<div class="visual-orbit"><span class="orbit-node orbit-node-a">${h(c.visualNodes[0])}</span><span class="orbit-node orbit-node-b">${h(c.visualNodes[1])}</span><span class="orbit-node orbit-node-c">${h(c.visualNodes[2])}</span><span class="orbit-core">${h(c.visualCore[0])}<br><b>${h(c.visualCore[1])}</b></span></div>
<div class="visual-foot"><span>${h(c.visualSteps[0])}</span><i></i><span>${h(c.visualSteps[1])}</span><i></i><span>${h(c.visualSteps[2])}</span></div></div></div>
<div class="hero-bottom"><span>${h(c.strap)}</span><a href="#soluciones">${h(c.discover)} <span aria-hidden="true">↓</span></a></div></section>
<section class="section service-section" id="soluciones"><div class="shell"><div class="section-heading service-heading"><p class="eyebrow">${h(c.servicesEyebrow)}</p><h2>${h(c.servicesTitle)}</h2><p>${h(c.servicesNote)}</p></div><div class="service-list">${serviceCards}</div></div></section>
<section class="section shell product-section" id="productos"><div class="section-heading split"><div><p class="eyebrow">${h(c.productsEyebrow)}</p><h2>${h(c.productsTitle[0])}<br>${h(c.productsTitle[1])}</h2></div><p>${h(c.productsIntro)}</p></div>
<div class="product-grid"><article class="product-teaser"><div class="product-top"><span class="product-kicker">${h(c.gestionLabel)}</span><span class="product-number" aria-hidden="true">01</span></div><div class="product-identity"><span class="product-line" aria-hidden="true"></span><h3>Axhum<br>Gestión Online</h3></div><p>${h(c.gestionDescription)}</p><a href="https://axhumgestion.com.ar/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axhum Gestión Online">${h(c.gestionLink)} <span aria-hidden="true">↗</span></a><span class="product-domain">axhumgestion.com.ar</span></article>
<article class="product-teaser"><div class="product-top"><span class="product-kicker">${h(c.axendaLabel)}</span><span class="product-number" aria-hidden="true">02</span></div><div class="product-identity"><span class="product-line" aria-hidden="true"></span><h3>Axenda</h3></div><p>${h(c.axendaDescription)}</p><a href="https://axenda.date/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axenda">${h(c.axendaLink)} <span aria-hidden="true">↗</span></a><span class="product-domain">axenda.date</span></article></div>
${c.productLanguage ? `<p class="small-note product-language">${h(c.productLanguage)}</p>` : ''}<a class="product-all-link" href="${link(locale, 'products')}">${h(c.allProducts)} <span aria-hidden="true">↗</span></a></section>
<section class="section company-section" id="empresa"><div class="shell closing-grid"><div><p class="eyebrow">${h(c.companyEyebrow)}</p><h2>${h(c.companyTitle[0])} <em>${h(c.companyTitle[1])}</em></h2></div><div><p>${h(c.companyText)}</p><a class="button button-light" href="${link(locale, 'contact')}">${h(c.companyCta)} <span aria-hidden="true">↗</span></a></div></div></section>`);
}

function services(locale) {
  const c = copy[locale].services;
  const offers = c.offers.map(([title, description]) => `<div><strong>${h(title)}</strong><span>${h(description)}</span></div>`).join('');
  return page(locale, 'services', `
<section class="page-intro shell" data-index="01"><p class="eyebrow">${h(c.eyebrow)}</p><h1>${h(c.headline)} <em>${h(c.accent)}</em></h1><p class="lead">${h(c.lead)}</p><a class="button button-primary" href="${link(locale, 'contact')}">${h(c.cta)} <span aria-hidden="true">↗</span></a></section>
<section class="section soft" id="webs"><div class="shell two-column"><div><p class="eyebrow">${h(c.webEyebrow)}</p><h2>${h(c.webTitle)}</h2><p>${h(c.webDescription)}</p></div><div class="offer-list">${offers}<a class="text-link" href="${link(locale, 'contact')}?interes=web">${h(c.webCta)} <span aria-hidden="true">→</span></a></div></div></section>
<section class="section shell two-column" id="software"><div><p class="eyebrow">${h(c.softwareEyebrow)}</p><h2>${h(c.softwareTitle)}</h2></div><div><p>${h(c.softwareDescription)}</p><p>${h(c.softwareTiming)}</p><a class="text-link" href="${link(locale, 'contact')}?interes=software">${h(c.softwareCta)} <span aria-hidden="true">→</span></a></div></section>
<section class="section line-top shell two-column" id="automatizaciones"><div><p class="eyebrow">${h(c.automationEyebrow)}</p><h2>${h(c.automationTitle)}</h2></div><div><p>${h(c.automationDescription)}</p><a class="text-link" href="${link(locale, 'contact')}?interes=automatizacion">${h(c.automationCta)} <span aria-hidden="true">→</span></a></div></section>
<section class="section dark-section"><div class="shell closing-grid"><div><p class="eyebrow">${h(c.closingEyebrow)}</p><h2>${h(c.closingTitle)}</h2></div><div><p>${h(c.closingDescription)}</p><a class="button button-light" href="${link(locale, 'contact')}">${h(c.closingCta)} <span aria-hidden="true">↗</span></a></div></div></section>`);
}

function products(locale) {
  const c = copy[locale].products;
  const desktop = desktopProducts.map((name, index) => `<div><strong>${h(name)}</strong><span>${h(c.desktopDescriptions[index])}</span></div>`).join('');
  const downloads = releases.map(({ name, version, repository, file }) => {
    const base = `https://github.com/maurotaberna/${repository}/releases`;
    return `<li><a href="${base}/tag/v${version}" target="_blank" rel="noopener noreferrer">${h(name)} ${version} · ${h(c.release)}</a> <a href="${base}/download/v${version}/${file}" data-track="download_clicked" data-track-product="${h(name)} ${version}">${h(c.download)} ↗</a></li>`;
  }).join('');
  return page(locale, 'products', `
<section class="page-intro shell" data-index="02"><p class="eyebrow">${h(c.eyebrow)}</p><h1>${h(c.headline)} <em>${h(c.accent)}</em></h1><p class="lead">${h(c.lead)}</p></section>
<section class="section shell featured-products"><article class="featured-product" id="gestion-online"><div><span class="product-kicker">${h(c.gestionLabel)}</span><h2>Axhum Gestión Online</h2><p>${h(c.gestionDescription)}</p><span class="product-note">${h(c.gestionNote)}</span></div><a class="button button-outline" href="https://axhumgestion.com.ar/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axhum Gestión Online">${h(c.productCta)} <span aria-hidden="true">↗</span></a></article>
<article class="featured-product" id="axenda"><div><span class="product-kicker">${h(c.axendaLabel)}</span><h2>Axenda</h2><p>${h(c.axendaDescription)}</p><span class="product-note">${h(c.axendaNote)}</span></div><a class="button button-outline" href="https://axenda.date/" target="_blank" rel="noopener noreferrer" data-track="product_visit" data-track-product="Axenda">${h(c.productCta)} <span aria-hidden="true">↗</span></a></article></section>
${c.productLanguage ? `<p class="shell small-note product-language">${h(c.productLanguage)}</p>` : ''}<section class="section soft" id="escritorio"><div class="shell two-column"><div><p class="eyebrow">${h(c.desktopEyebrow)}</p><h2>${h(c.desktopTitle)}</h2><p>${h(c.desktopDescription)}</p></div><div class="desktop-list">${desktop}<details class="downloads"><summary>${h(c.downloadsSummary)} <span aria-hidden="true">+</span></summary><div class="downloads-content">
<p>${h(c.downloadsLead)}</p><ul>${downloads}</ul><p class="small-note">${h(c.arcaNote)}</p><p class="small-note">${h(c.smartScreen)}</p></div></details></div></div></section>
<section class="section shell compact-cta"><h2>${h(c.closingTitle)}</h2><a class="button button-primary" href="${link(locale, 'contact')}">${h(c.closingCta)} <span aria-hidden="true">↗</span></a></section>`);
}

function contact(locale) {
  const c = copy[locale].contact;
  const whatsapp = `https://wa.me/543865267037?text=${encodeURIComponent(c.messageIntro)}`;
  const choices = c.options.map((label, index) =>
    `<option value="${['', 'web', 'software', 'automatizacion', 'gestion', 'axenda', 'otro'][index]}">${h(label)}</option>`).join('');
  return page(locale, 'contact', `
<section class="page-intro shell" data-index="03"><p class="eyebrow">${h(c.eyebrow)}</p><h1>${h(c.headline)} <em>${h(c.accent)}</em></h1><p class="lead">${h(c.lead)}</p></section>
<section class="section shell contact-grid"><div><h2>${h(c.directTitle)}</h2><p>${h(c.directDescription)}</p><a class="contact-method" href="${whatsapp}" target="_blank" rel="noopener noreferrer" data-track="whatsapp_clicked">${h(c.whatsapp)} <span>+54 3865 267037 ↗</span></a><a class="contact-method" href="mailto:hola@axhumtech.com" data-track="email_clicked">${h(c.email)} <span>hola@axhumtech.com ↗</span></a></div>
<form class="brief-form" data-brief-form><h2>${h(c.formTitle)}</h2><p>${h(c.formDescription)}</p>
<label>${h(c.name)} <input name="nombre" autocomplete="name" required maxlength="80"></label><label>${h(c.business)} <input name="negocio" required maxlength="100"></label>
<label>${h(c.interest)} <select name="interes" required>${choices}</select></label>
<label>${h(c.detail)} <textarea name="detalle" rows="4" required maxlength="1200" placeholder="${h(c.placeholder)}"></textarea></label><button class="button button-primary" type="submit">${h(c.submit)} <span aria-hidden="true">↗</span></button><p class="form-status" data-form-status role="status" hidden></p></form></section>`);
}

function notFound() {
  const locale = 'es';
  const c = copy.es.missing;
  return `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="noindex, follow"><title>${h(c.title)}</title><meta name="description" content="${h(c.description)}"><script src="./theme.js"></script><link rel="stylesheet" href="./styles.css"><script src="./analytics.js" defer></script><script src="./script.js" defer></script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: c.title })}</script></head><body>${header(locale, 'home')}<main id="contenido"><section class="page-intro shell"><p class="eyebrow">ERROR 404</p><h1>${h(c.headline)}</h1><p class="lead">${h(c.lead)}</p><div class="actions"><a class="button button-primary" href="${link(locale, 'home')}">${h(c.home)}</a><a class="text-link" href="${link(locale, 'contact')}">${h(c.contact)}</a></div></section></main>${footer(locale)}</body></html>`;
}

for (const locale of Object.keys(locales)) {
  const dir = locales[locale].folder ? join(output, locales[locale].folder) : output;
  mkdirSync(dir, { recursive: true });
  for (const [key, render] of Object.entries({ home, services, products, contact })) {
    writeFileSync(join(dir, `${locales[locale].files[key]}.html`), render(locale), 'utf8');
  }
}
writeFileSync(join(output, '404.html'), notFound(), 'utf8');
copyFileSync(join(root, 'src/site.css'), join(output, 'styles.css'));
copyFileSync(join(root, 'src/site.js'), join(output, 'script.js'));
console.log(`Vista previa generada: ${Object.keys(locales).length * pageKeys.length} páginas en ${Object.keys(locales).length} idiomas y 404.`);
