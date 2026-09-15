# Publicacion de instaladores oficiales

Actualizado: 2026-09-15.

Estos mensajes autorizan la publicacion de artefactos finales, no del codigo
fuente. Cada chat debe detenerse si la version, el hash o las pruebas no
coinciden.

## Axhum Service

Trabaja exclusivamente en `E:\Axhum Tech\Axhum Service`.

Objetivo: publicar el instalador oficial de Axhum Service 1.0.1 para que pueda
enlazarse desde axhumtech.com.

1. Revisa el estado del repositorio sin revertir ni mezclar cambios existentes.
2. Ejecuta `pnpm verify`; debe terminar con 117/117 pruebas correctas.
3. Verifica que la version sea 1.0.1 y que el archivo exacto sea
   `release\Axhum Service-Setup-1.0.1.exe`.
4. Confirma SHA-256
   `CF59B0FC9CD2BD36C553E15CEAA0EB990D88EC75EDD9DEB6327F520AF638658A`.
   Si no coincide, detenete y explica la diferencia. No publiques otro archivo.
5. Crea o utiliza un repositorio publico separado llamado
   `maurotaberna/AxhumService-releases`. No publiques el repositorio fuente.
6. Crea la version publica `v1.0.1` y sube solamente el instalador,
   `SHA256SUMS.txt` y documentacion breve y segura para el cliente.
7. Indica que incluye 15 dias de prueba y que Windows puede mostrar una
   advertencia porque el instalador aun no tiene firma digital. No afirmes que
   esta firmado y no propongas desactivar controles de seguridad.
8. No publiques codigo fuente, generadores de licencias, claves privadas,
   certificados, archivos `.env`, datos de clientes ni documentacion interna.
9. Devuelve: URL de la version, URL directa del instalador, tamano, SHA-256 y
   resultado de las pruebas. No modifiques la web de Axhum Tech.

## Axhum Comanda

Trabaja exclusivamente en
`E:\Axhum Tech\Axhum Comanda\AxhumComandaDesktop`.

Objetivo: publicar el instalador oficial de Axhum Comanda 1.0.1 para que pueda
enlazarse desde axhumtech.com.

1. Revisa el estado del repositorio sin revertir ni mezclar cambios existentes.
   El repositorio padre contiene otros productos: no cambies su remoto, no
   publiques su fuente y no toques carpetas hermanas.
2. Ejecuta `pnpm verify` y `pnpm smoke`; el smoke debe terminar con 67/67
   pruebas correctas.
3. Verifica que la version sea 1.0.1 y que el archivo exacto sea
   `release\Axhum Comanda-Setup-1.0.1.exe`.
4. Confirma SHA-256
   `82FB1009E01931A38DF9904D932D176FEF4EFDD8B0A04D835585E447EE945733`.
   Si no coincide, detenete y explica la diferencia. No publiques otro archivo.
5. Crea o utiliza un repositorio publico separado llamado
   `maurotaberna/AxhumComanda-releases`. No publiques el repositorio fuente.
6. Crea la version publica `v1.0.1` y sube solamente el instalador,
   `SHA256SUMS.txt` y documentacion breve y segura para el cliente.
7. Indica que incluye 15 dias de prueba y que Windows puede mostrar una
   advertencia porque el instalador aun no tiene firma digital. No afirmes que
   esta firmado y no propongas desactivar controles de seguridad.
8. No publiques codigo fuente, generadores de licencias, claves privadas,
   certificados, archivos `.env`, datos de clientes ni documentacion interna.
9. Devuelve: URL de la version, URL directa del instalador, tamano, SHA-256 y
   resultado de las pruebas. No modifiques la web de Axhum Tech.
