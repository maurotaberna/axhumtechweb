# Dominio axhumtech.com

## Objetivo

Publicar la web de Axhum Tech en `https://axhumtech.com` y mantener `https://axhumtech.pages.dev` solamente como dominio tecnico de Cloudflare Pages.

## Estado previo a la migracion

- Registrador y DNS actual: Hostinger.
- Nameservers detectados: `atlas.dns-parking.com` y `hyperion.dns-parking.com`.
- Dominio raiz: registro A de parking hacia `2.57.91.91`.
- `www`: CNAME hacia `axhumtech.com`.
- No se detectaron registros MX o TXT activos durante la auditoria inicial.
- Proyecto de destino: Cloudflare Pages `axhumtech`.

## Activacion en Cloudflare

1. Agregar `axhumtech.com` como sitio o zona en la cuenta de Cloudflare que contiene el proyecto Pages `axhumtech`.
2. Copiar los dos nameservers asignados por Cloudflare.
3. En Hostinger, reemplazar los nameservers de parking por los asignados por Cloudflare.
4. Esperar a que la zona aparezca como `Active` en Cloudflare.
5. En `Workers & Pages > axhumtech > Custom domains`, agregar `axhumtech.com`.
6. Verificar que Cloudflare cree el registro DNS y emita el certificado TLS.
7. Configurar `www.axhumtech.com` para redirigir con codigo 301 a `https://axhumtech.com`, conservando rutas y parametros.
8. Cuando el dominio principal funcione, redirigir `axhumtech.pages.dev` a `https://axhumtech.com` mediante Bulk Redirects.

## Validacion

- `https://axhumtech.com` responde con codigo 200 y certificado valido.
- `http://axhumtech.com` redirige a HTTPS.
- `https://www.axhumtech.com/ruta` redirige a `https://axhumtech.com/ruta`.
- `robots.txt` referencia `https://axhumtech.com/sitemap.xml`.
- El sitemap y las etiquetas canonical usan solamente `https://axhumtech.com`.
- El formulario de contacto, WhatsApp, imagen social y recursos de marca cargan correctamente.

## Precaucion

Antes de cambiar nameservers en el futuro, inventariar y recrear cualquier registro de correo, verificacion o servicio externo. La zona de esta web no se comparte con Gestion, Comanda, GymApp ni otros productos.
