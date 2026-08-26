# Dominio axhumtech.com

## Objetivo

Publicar la web de Axhum Tech en `https://axhumtech.com` y mantener `https://axhumtech.pages.dev` solamente como dominio tecnico de Cloudflare Pages.

## Estado actual

- Dominio principal: `https://axhumtech.com`.
- Estado en Cloudflare Pages: `Active`, con SSL habilitado.
- Nameservers autoritativos: `huxley.ns.cloudflare.com` y `kinsley.ns.cloudflare.com`.
- DNS raiz: CNAME proxificado hacia `axhumtech.pages.dev` mediante CNAME flattening.
- `www`: dominio personalizado de Pages con SSL, redirigido por codigo 301 al dominio raiz.
- `axhumtech.pages.dev`: URL tecnica redirigida por codigo 301 al dominio oficial.
- Las redirecciones conservan ruta y parametros de consulta.

La canonicalizacion vive en `public/_worker.js` y se copia a `builds/production/_worker.js` durante el build. Es una Pages Function en modo avanzado; las solicitudes del dominio oficial continúan hacia los archivos estaticos mediante `env.ASSETS`.

## Estado previo a la migracion

- Registrador y DNS actual: Hostinger.
- Nameservers detectados: `atlas.dns-parking.com` y `hyperion.dns-parking.com`.
- Dominio raiz: registro A de parking hacia `2.57.91.91`.
- `www`: CNAME hacia `axhumtech.com`.
- No se detectaron registros MX o TXT activos durante la auditoria inicial.
- Proyecto de destino: Cloudflare Pages `axhumtech`.

## Activacion en Cloudflare

1. Se agrego `axhumtech.com` como zona en la cuenta de Cloudflare que contiene el proyecto Pages `axhumtech`.
2. En Hostinger se reemplazaron los nameservers de parking por `huxley.ns.cloudflare.com` y `kinsley.ns.cloudflare.com`.
3. La zona se activo y se agregaron `axhumtech.com` y `www.axhumtech.com` como dominios personalizados de Pages.
4. Cloudflare creo los registros DNS proxificados y emitio los certificados TLS.
5. La aplicacion aplica redirecciones 301 hacia `https://axhumtech.com` desde cualquier hostname alternativo.

## Validacion

- `https://axhumtech.com` responde con codigo 200 y certificado valido.
- `http://axhumtech.com` redirige a HTTPS.
- `https://www.axhumtech.com/ruta?x=1` redirige a `https://axhumtech.com/ruta?x=1`.
- `https://axhumtech.pages.dev/ruta?x=1` redirige a `https://axhumtech.com/ruta?x=1`.
- `robots.txt` referencia `https://axhumtech.com/sitemap.xml`.
- El sitemap y las etiquetas canonical usan solamente `https://axhumtech.com`.
- El formulario de contacto, WhatsApp, imagen social y recursos de marca cargan correctamente.

## Precaucion

Antes de cambiar nameservers en el futuro, inventariar y recrear cualquier registro de correo, verificacion o servicio externo. La zona de esta web no se comparte con Gestion, Comanda, GymApp ni otros productos.
