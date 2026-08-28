# Sistema visual web

Actualizado: 2026-08-28. Direccion: minimalista, fria, corporativa y tecnologica.
Se aplicaron las indicaciones escritas; no habia una imagen adjunta accesible
en el mensaje de solicitud. No se utilizaron recursos externos nuevos.

## Alcance

- Se conservan las 13 paginas, URLs, contenido comercial, formularios y diagramas.
- El lema sigue siendo: Desarrollamos soluciones digitales que hacen crecer tu negocio.
- Portada editorial alineada a la izquierda; solo la palabra crecer lleva acento.
- Servicios de portada separados por lineas, sin cajas ni brillos decorativos.
- Fondos claros predominantes; productos y llamadas a la accion usan azul marino.
- Botones rectangulares con radios de 6 px, sombras discretas y tipografia legible.
- No se modificaron archivos, proporciones ni colores del logo oficial.
  Los logos de producto ya no se invierten por CSS; se muestran sobre blanco.

## Paleta de interfaz

| Uso | Claro | Oscuro |
| --- | --- | --- |
| Fondo | #FFFFFF | #101E2D |
| Panel | #FFFFFF | #17283A |
| Superficie secundaria | #F4F6F8 | #132335 |
| Texto principal | #152F45 | #EEF3F8 |
| Texto secundario | #4B6071 | #BDCCDA |
| Texto auxiliar | #627384 | #A1B3C5 |
| Acento | #A65327 | #E3A575 |
| Separadores | #DDE4EA | #2D4256 |

Las secciones azul marino tienen su propio contexto de contraste en ambos modos:
texto claro y botones cobre claro con texto azul. No invertir toda la pagina ni
aplicar filtros a las imagenes. La paleta de interfaz no recolorea el logo.

Manrope se mantiene en titulos, con peso 600; DM Sans en lectura y acciones;
IBM Plex Mono se reserva para etiquetas y datos. Se reducen sombras, radios y
movimientos. Se retiran el brillo que seguia al cursor, fondos animados y reticula
decorativa de la portada. Los diagramas explicativos conservan su interaccion.

## Tema

El modo inicial es claro, incluso si el sistema operativo prefiere oscuro.
El boton de luna/sol de la cabecera permite elegir y funciona en escritorio y
movil. Su nombre accesible es Modo oscuro y `aria-pressed` informa si esta activo.

`builds/preview/theme.js` aplica el tema antes de cargar el CSS. La eleccion se
guarda en `localStorage` bajo `axhum-theme`, se recupera en otras paginas y se
sincroniza entre pestanas del mismo origen. Si el almacenamiento esta bloqueado,
el cambio sigue funcionando en la pagina actual, sin prometer persistencia.
Sin JavaScript se usa la version clara y se oculta el selector inoperante.

## Mantenimiento

- HTML y estructura: `builds/preview/*.html`.
- Tokens, componentes y responsive: `builds/preview/styles.css`.
- Preferencia de tema: `builds/preview/theme.js`.
- Navegacion, diagramas y formulario: `builds/preview/script.js`.
- Logo y assets originales: `assets/branding/`, sin cambios.
- Copia y versionado de recursos: `src/build-production.ps1`.
- Build generado: `builds/production/`; no editarlo a mano.
- Publicacion: workflow de GitHub Actions hacia Cloudflare Pages.

## Verificacion

```powershell
./src/build-production.ps1
node --check builds/production/script.js
node --check builds/production/theme.js
node src/validate-seo.mjs
node --test src/validate-seo.test.mjs src/theme.test.mjs
```

La suite del tema cubre inicio claro, restauracion antes del render, alternancia,
almacenamiento bloqueado, sincronizacion y presencia/versionado en cada pagina.
Se comparo el texto del body con la revision anterior: contenido comercial intacto.

Revision en navegador: 13 paginas en ambos temas a 320 px, portada a 390 y
1440 px, menu movil, selector del canal de contacto, persistencia entre paginas
y diagrama interactivo. Sin desbordamientos ni imagenes rotas en esa revision.
Se comprobaron pares de color de textos/acciones principales de la portada con
contraste minimo 4.5:1; esto no equivale a una auditoria integral de accesibilidad.
