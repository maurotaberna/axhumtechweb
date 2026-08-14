# GitHub y Cloudflare Pages

## Fuente oficial

- Repositorio: `https://github.com/maurotaberna/axhumtechweb`
- Rama de produccion: `main`
- Proyecto Cloudflare Pages: `axhumtech`
- URL publica: `https://axhumtech.pages.dev`

El repositorio contiene codigo, contenido, branding y documentacion de la web. No se versionan `_legacy`, `backups` ni `builds/production`.

## Por que Pages y no Worker

La web actual es estatica: HTML, CSS, JavaScript y recursos de marca. Cloudflare Pages resuelve hosting, CDN, HTTPS, versiones y rollback sin una aplicacion de servidor.

Un Worker o Pages Functions se agregara solo si aparece una necesidad concreta, por ejemplo:

- Formulario propio con envio de correo.
- API para cotizaciones o captacion.
- Integraciones con CRM u otras plataformas.
- Contenido privado o autenticacion.
- Logica dinamica ejecutada en el servidor.

## Flujo actual

1. Editar `builds/preview/` y el contenido fuente correspondiente.
2. Ejecutar `powershell -ExecutionPolicy Bypass -File .\src\build-production.ps1`.
3. Validar `builds/production/`.
4. Desplegar con `npx.cmd wrangler pages deploy builds/production --project-name axhumtech --branch main`.

## Automatizacion con GitHub Actions

El proyecto Pages actual fue creado mediante Direct Upload. Cloudflare no permite convertirlo despues en un proyecto con integracion Git nativa. Para conservar `axhumtech.pages.dev`, la automatizacion recomendada es GitHub Actions con Wrangler.

Antes de activar el workflow se necesitan dos secretos en `GitHub > Settings > Secrets and variables > Actions`:

- `CLOUDFLARE_ACCOUNT_ID`: ID de la cuenta de Cloudflare.
- `CLOUDFLARE_API_TOKEN`: token personalizado con permiso `Account > Cloudflare Pages > Edit`, limitado a la cuenta de Axhum Tech.

Nunca guardar el token dentro del repositorio.
