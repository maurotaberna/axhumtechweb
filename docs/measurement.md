# Medicion comercial de la web

Actualizado: 2026-09-15.

La web ya tiene preparada la integracion con Google Analytics 4 (GA4). Permanece
completamente inactiva mientras `measurementId` este vacio en
`builds/preview/analytics.js`.

## Activacion

1. En Google Analytics, crear o elegir la propiedad de Axhum Tech.
2. Crear un flujo de datos web para `https://axhumtech.com`.
3. Copiar el ID de medicion con formato `G-XXXXXXXXXX`.
4. Colocarlo en `measurementId` dentro de `builds/preview/analytics.js`.
5. Generar el build de produccion, validar y publicar solo con aprobacion.

Al configurarse un ID valido, la web muestra un aviso con `Aceptar` y
`Rechazar`. La etiqueta de Google no se descarga antes de la aceptacion. La
eleccion se guarda en el navegador bajo `axhum-analytics-consent`.

## Eventos preparados

- `contact_form_started`: primera interaccion con el formulario.
- `contact_form_prepared`: el visitante completo el formulario y la web preparo
  WhatsApp o correo. No equivale a un mensaje enviado.
- `whatsapp_clicked`: clic en un enlace comercial de WhatsApp marcado para medicion.
- `download_clicked`: clic en una descarga publica de producto.
- `trial_requested`: solicitud de una prueba de producto.

## Conversiones recomendadas

Marcar como eventos clave en GA4:

- Principal: `contact_form_prepared`.
- Principal: `trial_requested`.
- Secundario: `whatsapp_clicked`.
- Secundario: `download_clicked`.

`contact_form_started` es diagnostico: sirve para detectar abandono, no para
contar consultas.

## Datos permitidos

Los eventos solo admiten ruta, producto, canal, interes y rango de presupuesto.
No se envian nombres, telefonos, correos, texto libre, rubro detallado ni el
contenido del formulario. Google Signals y la personalizacion publicitaria se
mantienen desactivados en esta integracion.

## Verificacion

Despues de publicar:

1. Abrir la web en una ventana privada y rechazar: no debe cargarse
   `googletagmanager.com`.
2. Repetir y aceptar: debe aparecer la visita en Tiempo real de GA4.
3. Probar formulario, WhatsApp y descargas.
4. Confirmar los nombres de evento en DebugView o Tag Assistant.
5. Verificar que ningun parametro contenga datos personales.

Un clic o un mensaje preparado no se contabiliza como venta.
