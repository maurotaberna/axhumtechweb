# Axhum Tech Web

Proyecto independiente para presentacion, posicionamiento, captacion y comunicacion comercial de Axhum Tech.

## Objetivo

Mantener la web separada de Gestion, Comanda, Gym y SaaS, con una estructura clara para contenido, activos, codigo, builds y respaldo.

## Estructura principal

- `content/`: copys, paginas y servicios en formato fuente.
- `assets/`: imagenes, logos y recursos reutilizables.
- `src/`: implementacion web cuando exista codigo.
- `public/`: archivos estaticos servidos sin procesar.
- `docs/`: decisiones, mapa de estructura y notas de mantenimiento.
- `builds/`: entregas o snapshots publicables.
- `backups/`: respaldos de trabajo.
- `_legacy/`: material viejo, de prueba o importado sin curar.

## Fuentes de referencia ya separadas

- `_legacy/source/Website/`
- `_legacy/source/Branding/`

## Branding oficial

- Identidad: logo maestro circular de Axhum Tech.
- Fuentes oficiales: `assets/branding/logos/`.
- Pieza social: `assets/branding/social/axhum-tech-og.png`.
- Version anterior: `_legacy/branding-v1-placeholder-20260802/`.

## Web navegable

El prototipo estatico navegable vive en `builds/preview/` e incluye:

- Inicio.
- Axhum Gestion.
- Axhum Comanda.
- Servicios.
- Nosotros.
- Contacto.

## Publicacion

- Repositorio oficial: `https://github.com/maurotaberna/axhumtechweb`.
- Hosting: Cloudflare Pages.
- URL: `https://axhumtech.pages.dev`.
- Build: `powershell -ExecutionPolicy Bypass -File .\src\build-production.ps1`.
- Salida generada: `builds/production/`.

La integracion y los pasos de despliegue se documentan en `docs/github-cloudflare.md`.
