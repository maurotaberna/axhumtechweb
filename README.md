# Axhum Tech Web

Web institucional independiente de Gestion, Comanda, SaaS y el resto de productos.
Su función es presentar la empresa, explicar sus servicios, mostrar productos
disponibles y convertir visitas en consultas. El sitio público tiene cuatro
páginas: Inicio (`/`), Servicios (`/servicios`), Productos (`/productos`) y
Contacto (`/contacto`).

## Dónde vive cada parte

| Área | Ruta | Función |
| --- | --- | --- |
| Contenido publicado y componentes compartidos | `src/build-site.mjs` | Copy, HTML, navegación y metadatos de las cuatro páginas |
| Estilos editables | `src/site.css` | Diseño, responsive y modo oscuro |
| Interacciones editables | `src/site.js` | Eventos y formulario sin backend |
| Marca y límites comerciales | `content/` | Fuente de verdad para afirmaciones y tono |
| Logos y recursos aprobados | `assets/` | Identidad oficial, sin archivos operativos de otros productos |
| Archivos públicos y redirects | `public/` | Sitemap, robots, Worker, cabeceras e iconos |
| Vista local generada | `builds/preview/` | HTML con rutas relativas; no editar a mano |
| Build desplegable | `builds/production/` | Salida con URLs limpias y assets |
| Decisiones | `docs/` | Arquitectura, SEO y despliegue |
| Respaldo anterior | `backups/site-before-minimal-2026-09-29/` | Copia local no publicada |
| Material antiguo | `_legacy/` | Fuentes históricas separadas |

`builds/preview/theme.js` y `builds/preview/analytics.js` conservan la lógica
existente de tema y medición con consentimiento. Los productos externos
permanecen en sus propios dominios y repositorios.

## Construir y validar

```powershell
./src/build-production.ps1
node src/validate-seo.mjs
node --test src/*.test.mjs
```

El build ejecuta `src/build-site.mjs`, genera la vista previa y luego prepara
`builds/production/`. Para ver la vista local:

```powershell
python -m http.server 5410 --directory "E:\Axhum Tech\Web Axhum Tech"
```

Abrir `http://127.0.0.1:5410/builds/preview/index.html`. Servir la raíz del
proyecto permite cargar `../../assets/`.

## Publicación

Repositorio: `https://github.com/maurotaberna/axhumtechweb`. El push a `main`
construye y publica en Cloudflare Pages (`axhumtech.com`). `public/_worker.js`
redirige las URLs antiguas a las cuatro páginas nuevas. Ver
`docs/github-cloudflare.md` y `docs/seo.md` antes de desplegar.
