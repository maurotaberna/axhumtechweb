# Oferta web de Axhum Tech

Nota histórica: esta propuesta de tres tarjetas fue reemplazada por el
rediseño minimalista del 29/09/2026. La oferta de landing, web/catálogo y
tienda sigue vigente en la página `/servicios`, pero la estructura pública
actual se documenta en `README.md` y `docs/seo.md`.

Fecha: 27/09/2026.

## Referencia y criterio

La pagina de AXUM VM presenta tres niveles consecutivos: sitio institucional,
catalogo y tienda. La eleccion se entiende rapido porque cada opcion tiene
nombre, descripcion, una lista breve y una accion. Su CSS usa columnas parejas,
mucho blanco, separacion generosa y un acento corto bajo el titulo.

Axhum toma esa logica de comparacion y la reinterpreta con su propia identidad:
Manrope/DM Sans, blanco frio, azul marino, cobre discreto y modo oscuro. No se
copian hojas de estilo, imagenes, textos, nombres de planes ni promesas de
dominios o correos gratuitos.

## Oferta simple

| Opcion | Necesidad | Mensaje comercial | Siguiente paso |
| --- | --- | --- | --- |
| Landing page | Conseguir consultas o reservas desde una propuesta concreta | Una pagina, un objetivo. Desde USD 100. | Consulta identificada como landing |
| Web y catalogo | Presentar empresa, servicios o productos sin cobro online obligatorio | Mas contenido y estructura para que el visitante entienda la oferta. | Consulta identificada como web/catalogo |
| Tienda online | Vender por internet y organizar pedidos | Recorrido de compra y opciones de pago y entrega definidas con el negocio. | Consulta identificada como tienda |

No se fijan cantidad de secciones, dominio incluido por un plazo, correo
institucional, pasarela, integraciones o mantenimiento sin una propuesta.
Cada cotizacion debe aclarar entregables, plazo, costo inicial, renovaciones,
propiedad del dominio y soporte.

## Implementacion en la web

1. Resumir `/webs` en tres opciones y una base comun. Conservar FAQ y contacto.
2. Usar tarjetas blancas de igual altura, sombra sutil, lista de tres puntos y
   una accion por opcion. El cobre queda en numeros, subrayado y detalles.
3. Mantener `#tiendas` para los enlaces existentes y `#incluye` para la
   navegacion interna.
4. Actualizar el catalogo: Gestion Online lleva a su portada y a `/app/`;
   Axenda se presenta como agenda de reservas con enlace a su sitio.
5. Verificar en escritorio, movil, modo oscuro, enlaces, SEO y build de Pages
   antes de publicar.

## Situacion de los productos consultados

- `axhumgestion.com.ar` responde con una portada comercial, registro de
  prueba, planes y acceso de comerciantes en `/app/`. El antiguo mensaje de
  incorporacion solo coordinada y su precio fijo no deben repetirse en la web
  institucional.
- `www.axhumgestion.com.ar` no resolvio DNS durante esta revision. Conviene
  configurar una redireccion al dominio raiz.
- `axenda.date` carga su portada publica con selector de rubro, acceso y alta
  de pagina. El producto muestra pagina de reservas, agenda, personalizacion
  y prueba de 15 dias. La primera carga tardó unos segundos en el navegador
  de revision; se verificó que luego apareció la portada completa.

## Siguiente iteracion comercial

- Incorporar ejemplos reales de webs entregadas solo con permiso del cliente.
- Medir consultas por tipo de proyecto y ajustar la oferta segun demanda.
- Preparar una propuesta breve reutilizable para cada opcion, con alcance,
  entregables, tiempos y costos de continuidad.
