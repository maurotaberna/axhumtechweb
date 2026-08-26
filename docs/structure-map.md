# Mapa de estructura

Este documento define donde vive cada parte de la web de Axhum Tech.

## Capas del proyecto

| Area | Ubicacion | Uso |
| --- | --- | --- |
| Contenido editorial | `content/` | Paginas, servicios, mensajes y copys base |
| Identidad reutilizable | `assets/branding/` | Logos SVG, marca y recursos graficos aprobados |
| Implementacion | `src/` | Codigo de la web cuando se construya |
| Componentes UI | `src/components/` | Componentes visuales y reutilizables cuando exista codigo |
| Publico estatico | `public/` | Archivos servidos directamente |
| Documentacion | `docs/` | Estructura, decisiones y mantenimiento |
| Entregas | `builds/` | Versiones publicables o paquetes listos |
| Respaldos | `backups/` | Copias de trabajo y recuperacion |
| Legado | `_legacy/` | Material antiguo, de prueba o importado |

## Fuentes importadas

- `Website/README.md` paso a `_legacy/source/Website/README.md`
- `Website/servicios/landings-y-webs-locales.md` paso a `_legacy/source/Website/servicios/landings-y-webs-locales.md`
- `Branding/README.md` paso a `_legacy/source/Branding/README.md`
- `Branding/logos/*.svg` se copiaron a `assets/branding/logos/`

## Regla operativa

Todo material nuevo para la web debe entrar primero por `content/` o `assets/` segun corresponda. Si es una prueba, borrador o importacion sin revisar, va a `_legacy/` o `backups/`.

## Despliegue

Cloudflare Pages, proyecto `axhumtech`, dominio `axhumtech.com`. El build lo
genera `src/build-production.ps1` desde `builds/preview/` y lo publica el flujo
de GitHub Actions en cada push a `main`. Detalle en `docs/github-cloudflare.md`,
`docs/deployment.md` y `docs/seo.md`.
