# Generador del logo Axhum Tech

`iso.py` define la geometria del isotipo (A turquesa + estela) y `gen.py` arma todos los
archivos: logos horizontal y vertical (claro/oscuro), variantes del isotipo, `public/favicon.svg`,
`public/favicon-512.png`, la imagen OG y los PNG de vista previa. El texto se convierte a trazos
con Montserrat (variable, de Google Fonts), asi el SVG no depende de fuentes instaladas.

```powershell
python -m pip install --target .\.py resvg-py uharfbuzz fonttools
python -I gen.py .\.py C:\ruta\Montserrat[wght].ttf "E:\Axhum Tech\Web Axhum Tech"
```

Despues correr `./src/build-production.ps1` para regenerar la web.
