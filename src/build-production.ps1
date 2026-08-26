$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourceDir = Join-Path $projectRoot "builds/preview"
$outputDir = Join-Path $projectRoot "builds/production"
$expectedOutput = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "builds/production"))

if (-not (Test-Path -LiteralPath $sourceDir -PathType Container)) {
  throw "No se encontro el sitio fuente en $sourceDir"
}

if ([System.IO.Path]::GetFullPath($outputDir) -ne $expectedOutput) {
  throw "El directorio de salida no coincide con builds\production."
}

if (Test-Path -LiteralPath $outputDir) {
  Remove-Item -LiteralPath $outputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $outputDir | Out-Null
Get-ChildItem -LiteralPath $sourceDir -Filter "*.html" | Copy-Item -Destination $outputDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "styles.css") -Destination $outputDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "script.js") -Destination $outputDir -Force

$outputBranding = Join-Path $outputDir "assets/branding"
New-Item -ItemType Directory -Path $outputBranding -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "assets/branding/logos") -Destination $outputBranding -Recurse -Force

$outputSocial = Join-Path $outputBranding "social"
New-Item -ItemType Directory -Path $outputSocial | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "assets/branding/social/axhum-tech-og.png") -Destination $outputSocial -Force

@("favicon.svg", "favicon-512.png", "_headers", "_worker.js", "robots.txt", "sitemap.xml") | ForEach-Object {
  Copy-Item -LiteralPath (Join-Path $projectRoot "public/$_") -Destination $outputDir -Force
}

# Huella de la hoja de estilos y del script. Sin esto, Cloudflare sigue
# sirviendo la version anterior hasta un dia entero (`_headers` les pone
# max-age=86400) y un despliegue queda con el HTML nuevo y los estilos viejos.
# Ya paso una vez: el sitio salio sin CSS ni JS.
$huella = {
  param($archivo)
  (Get-FileHash -LiteralPath (Join-Path $outputDir $archivo) -Algorithm SHA256).Hash.Substring(0, 10).ToLower()
}
$vCss = & $huella "styles.css"
$vJs = & $huella "script.js"

# UTF-8 sin BOM, explicito: Windows PowerShell 5.1 lee/escribe ANSI por defecto
# y eso rompe los acentos de los datos estructurados JSON-LD.
$utf8 = New-Object System.Text.UTF8Encoding($false)

Get-ChildItem -LiteralPath $outputDir -Filter "*.html" | ForEach-Object {
  $html = [System.IO.File]::ReadAllText($_.FullName, $utf8)
  $html = $html.Replace("../../assets/", "./assets/")
  $html = $html.Replace("../../public/", "./")
  $html = $html.Replace('href="./styles.css"', 'href="./styles.css?v=' + $vCss + '"')
  $html = $html.Replace('src="./script.js"', 'src="./script.js?v=' + $vJs + '"')

  # URLs limpias. Cloudflare Pages redirige /pagina.html a /pagina con un 308,
  # asi que si dejaramos los .html cada enlace interno y cada canonical
  # apuntaria a una redireccion. En builds/preview los .html se conservan
  # porque ahi el sitio se abre directamente desde el disco.
  $html = $html.Replace('href="./index.html"', 'href="/"')
  $html = $html.Replace('href="./index.html#', 'href="/#')
  $html = [regex]::Replace($html, 'href="\./([a-z0-9-]+)\.html(#[a-z0-9-]+)?"', 'href="/$1$2"')
  $html = $html.Replace("https://axhumtech.com/index.html", "https://axhumtech.com/")
  $html = [regex]::Replace($html, 'https://axhumtech\.com/([a-z0-9-]+)\.html', 'https://axhumtech.com/$1')
  $html = $html.Replace("axhum-tech-logo-professional-50kb.png`"", "axhum-tech-logo-professional-50kb.png?v=logo-professional-20260821`"")
  $html = $html.Replace("axhum-tech-logo-on-light.svg`"", "axhum-tech-logo-on-light.svg?v=mark-centered-20260826`"")
  $html = $html.Replace("axhum-mark-on-light.svg`"", "axhum-mark-on-light.svg?v=mark-centered-20260826`"")
  $html = $html.Replace("axhum-gestion-logo-on-light.svg`"", "axhum-gestion-logo-on-light.svg?v=mark-centered-20260826`"")
  $html = $html.Replace("axhum-comanda-logo-on-light.svg`"", "axhum-comanda-logo-on-light.svg?v=mark-centered-20260826`"")
  $html = $html.Replace("axhum-tech-og.png`"", "axhum-tech-og.png?v=logo-master-20260814`"")
  $html = $html.Replace("favicon-512.png`"", "favicon-512.png?v=mark-centered-20260826`"")
  $html = $html.Replace("favicon.svg`"", "favicon.svg?v=mark-centered-20260826`"")
  [System.IO.File]::WriteAllText($_.FullName, $html, $utf8)
}

Write-Host "Build de produccion creado en $outputDir"
