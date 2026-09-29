# Sistema visual web

Actualizado: 2026-09-29. Direccion: editorial corporativa, clara y tecnologica.
La web conserva cuatro paginas: inicio, servicios, productos y contacto.

## Principios

- Mucho espacio negativo, tipografia de gran escala y jerarquia comercial breve.
- Superficies blancas y gris frio; azul marino para contraste y cobre solo como acento.
- Tarjetas de radio amplio (22-32 px), controles de 14 px y sombras discretas.
- Composiciones asimetricas y separadores finos en lugar de una reticula uniforme de tarjetas.
- Movimiento limitado a la entrada inicial y estados de interaccion; respetar `prefers-reduced-motion`.
- Nada de capturas de producto ficticias, cifras no verificadas o fotos de banco genericas.
- El logo oficial se usa sin redibujar, deformar o recolorear sus archivos.

## Paleta y tipografia

Los tokens de `src/site.css` son la fuente de verdad. En claro: blanco `#FFFFFF`,
superficie `#F4F6F8`, texto `#152F45`, azul institucional `#102D43` y cobre
`#A65327`. En oscuro: fondo `#101E2D`, superficie `#172A3B`, texto `#EEF3F8`
y acento `#E3A575`. Los paneles azules mantienen contraste propio en ambos temas.

Manrope se utiliza en titulos y etiquetas; DM Sans en lectura, controles y
acciones. El peso y el interlineado deben priorizar legibilidad sobre densidad.

## Componentes

- Portada: titular y CTA a la izquierda; composicion geometrica original a la
  derecha, declarada decorativa para lectores de pantalla. No representa una
  interfaz real de producto.
- Servicios: una tarjeta principal azul marino y dos tarjetas secundarias, con
  simbolos lineales de CSS; la pagina de servicios desarrolla la oferta.
- Productos: dos proyectos online confirmados, Axhum Gestion Online y Axenda,
  en superficies diferenciadas. Las herramientas de escritorio y descargas
  viven en la pagina de productos.
- Paginas internas: encabezado numerado, secciones breves y CTA contextual.
- Contacto: canales directos y formulario que prepara un mensaje de WhatsApp;
  no envia ni almacena datos por si mismo.

## Tema y accesibilidad

El tema inicial es claro. El control de cabecera cambia a oscuro y guarda la
eleccion bajo `axhum-theme` cuando `localStorage` esta disponible. El script
`builds/preview/theme.js` aplica el tema antes del CSS. El selector conserva
`aria-pressed`; sin JavaScript se oculta. La navegacion tiene enlace de salto,
estados de foco visibles y menu movil. Toda animacion se desactiva con
`prefers-reduced-motion`.

## Mantenimiento y verificacion

- Editar estructura, textos y componentes compartidos en `src/build-site.mjs`.
- Editar tokens, componentes y responsive en `src/site.css`.
- Editar interacciones en `src/site.js`.
- `builds/preview/` y `builds/production/` son salidas generadas: no editar su
  HTML o CSS manualmente.
- Generar con `./src/build-production.ps1` y comprobar con
  `node --test src/*.test.mjs`.
- Antes de publicar, revisar inicio y las tres paginas internas en desktop y
  movil, en ambos temas, y verificar enlaces de contacto y productos.

El despliegue de produccion se describe en `docs/github-cloudflare.md`.
