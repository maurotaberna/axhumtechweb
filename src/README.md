# Herramientas de la web

- `build-production.ps1`: genera `builds/production/` desde `builds/preview/`,
  copia assets y archivos publicos, normaliza URLs y versiona CSS/JS.
- `validate-seo.mjs`: verifica el resultado del build (metadatos, JSON-LD,
  identidad remota, sitemap, recursos y enlaces internos). Usa solo Node.js.

Desde la raiz del proyecto:

```powershell
./src/build-production.ps1
node --check builds/production/script.js
node src/validate-seo.mjs
node --test src/validate-seo.test.mjs
node --test src/theme.test.mjs
```

El HTML/CSS/JS editable vive en `builds/preview/`, no en esta carpeta.
Los textos de referencia viven en `content/`, los assets en `assets/` y los
archivos de rastreo/despliegue en `public/`. GitHub Actions ejecuta las
validaciones antes de publicar en Cloudflare Pages.

El validador revisa las convenciones del HTML estatico de este proyecto; no
sustituye una prueba visual ni la inspeccion de URL de Search Console.

El build tambien copia y versiona `theme.js`, cargado antes del CSS para recuperar
el tema guardado sin un destello del modo equivocado. El sistema visual y sus
pruebas estan documentados en `docs/visual-system.md`.
