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

- Dominio oficial: `https://axhumtech.com`.
- Dominio tecnico de Pages: `https://axhumtech.pages.dev`.
- DNS autoritativo: Cloudflare, una vez reemplazados los nameservers del registrador.
- Proyecto asociado: `Workers & Pages > axhumtech > Custom domains`.
- `www.axhumtech.com` debe redirigir con codigo 301 a `https://axhumtech.com`, conservando ruta y parametros.

Durante una migracion se conserva el subdominio `pages.dev` hasta validar DNS, certificado TLS, dominio raiz y redireccion de `www`. No se reutilizan zonas ni proyectos de otros productos Axhum.

## Regla

No asumir que comparte despliegue con Gestion, Comanda, Gym o SaaS. Esta web se documenta y publica como proyecto independiente.
