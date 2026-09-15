# Medicion comercial de la web

Actualizado: 2026-09-15.

La web tiene activa la integracion con Google Analytics 4 (GA4), identificador
`G-0QX9YV7TZ6`. La etiqueta de Google solo se descarga despues de que el visitante
acepta la medicion.

## Activacion

1. Propiedad de Axhum Tech creada en Google Analytics.
2. Flujo de datos web configurado para `https://axhumtech.com`.
3. ID de medicion instalado en `builds/preview/analytics.js`.
4. Build, validacion y publicacion realizados desde el repositorio oficial.

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
