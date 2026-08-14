# Deployment

La web se publica como un proyecto independiente en Cloudflare Pages.

## Configuracion

- Proyecto de Pages: `axhumtech` si el nombre se encuentra disponible.
- Fuente publicable: `builds/production/`.
- Build local: `powershell -ExecutionPolicy Bypass -File .\src\build-production.ps1`.
- Despliegue: `npx.cmd wrangler pages deploy builds/production --project-name axhumtech`.
- Variables de entorno: ninguna para la version estatica actual.

El build copia solamente las paginas, los recursos activos y los archivos publicos. `_legacy`, `backups`, `content` y `docs` no se despliegan.

## Rollback

Cloudflare Pages conserva los despliegues anteriores. El rollback se realiza desde `Workers & Pages > axhumtech > Deployments`, seleccionando una version estable y usando `Rollback to this deployment`.

## Dominio

El dominio inicial es el subdominio `pages.dev` asignado por Cloudflare. Un dominio propio se agrega luego desde `Custom domains`, sin mezclar DNS o despliegues de otros productos Axhum.

## Regla

No asumir que comparte despliegue con Gestion, Comanda, Gym o SaaS. Esta web se documenta y publica como proyecto independiente.
