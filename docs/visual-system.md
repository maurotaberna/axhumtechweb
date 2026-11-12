# Sistema visual web

Actualizado: 2026-11-12 (marca turquesa + azul marino). Direccion: editorial corporativa, clara y tecnologica.
La web conserva cuatro paginas: inicio, servicios, productos y contacto.

## Principios

- Mucho espacio negativo, tipografia de gran escala y jerarquia comercial breve.
- Superficies blancas y gris frio; azul marino para contraste y turquesa como acento de marca.
- Paneles oscuros con el degradado de marca: azul marino que se abre a turquesa en una esquina.
- Tarjetas de radio amplio (22-32 px), controles de 14 px y sombras discretas.
- Composiciones asimetricas y separadores finos en lugar de una reticula uniforme de tarjetas.
- Movimiento limitado a la entrada inicial y estados de interaccion; respetar `prefers-reduced-motion`.
- Nada de capturas de producto ficticias, cifras no verificadas o fotos de banco genericas.
- El logo oficial (A turquesa con estela) se usa sin deformar ni recolorear; se regenera desde `assets/branding/generador/`.

## Paleta y tipografia

Los tokens de `src/site.css` son la fuente de verdad. Marca: turquesa `#18C4B8`,
azul marino `#0F172A`, blanco `#FFFFFF`, gris medio `#64748B` y gris claro `#E2E8F0`.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--paper` | `#FFFFFF` | `#0F172A` | Fondo |
| `--surface` | `#F4F7FA` | `#152036` | Secciones y tarjetas suaves |
| `--ink` | `#0F172A` | `#F1F5F9` | Texto principal |
| `--muted` | `#5B6B80` | `#94A3B8` | Texto secundario (AA sobre fondo y superficie) |
| `--line` | `#E2E8F0` | `#263449` | Bordes y separadores |
| `--brand` | `#18C4B8` | `#18C4B8` | Lineas, puntos, subrayados, foco, hover |
| `--accent` | `#08766F` | `#18C4B8` | Texto turquesa chico: etiquetas, enlaces (AA 5:1) |
| `--accent-display` | `#0E9A91` | `#18C4B8` | Palabras destacadas en titulos grandes |
| `--button` | `#0F172A` | `#18C4B8` | Boton principal; hover turquesa con texto azul marino |
| `--panel` | degradado | degradado | Hero, tarjeta principal de servicios y bloque empresa |

El turquesa de marca `#18C4B8` no se usa como color de texto sobre fondos claros
(contraste 2,2:1); para eso existe `--accent`. Sobre azul marino contrasta 8,2:1.

Montserrat es la unica familia: Bold en titulos, SemiBold en etiquetas y
controles, Regular/Medium en lectura. Por su ancho, los titulos usan tracking
negativo moderado (-0,035em) y en movil se achican para no cortar palabras largas
(NL/FR). El peso y el interlineado priorizan legibilidad sobre densidad.

## Componentes

- Portada: titular y CTA a la izquierda; composicion geometrica original a la
  derecha, declarada decorativa para lectores de pantalla. No representa una
  interfaz real de producto.
- Servicios: una tarjeta principal con el degradado de marca y dos tarjetas secundarias, con
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
  movil, en ambos temas, y verificar enlaces de contacto y productos. Comprobar
  a 320 px que ningun titulo de NL/FR quede cortado.

El despliegue de produccion se describe en `docs/github-cloudflare.md`.
