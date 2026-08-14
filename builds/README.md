# Builds

Versiones exportadas o paquetes listos para publicar.

## Preview actual

`preview/` contiene un prototipo estatico navegable de la web institucional. Incluye Inicio, Axhum Gestion, Axhum Comanda, Servicios, Nosotros y Contacto.

No es todavia un build de produccion: no incluye analitica, dominio definitivo, correo corporativo, SEO tecnico completo ni integracion con un gestor de contenido.

## Regla

- Cada build debe tener identificacion clara.
- No usar esta carpeta como fuente de trabajo.
- Cuando se implemente el frontend, la fuente vivira en `src/` y el resultado exportado se copiara a una carpeta versionada dentro de `builds/`.
