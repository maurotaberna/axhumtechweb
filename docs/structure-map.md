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

El destino de despliegue todavia no esta definido. Cuando se elija, debe quedar documentado en `docs/deployment.md` junto con el flujo de build, variables de entorno y canal de publicacion.
