$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourceDir = Join-Path $projectRoot "builds/preview"
$outputDir = Join-Path $projectRoot "builds/production"
$expectedOutput = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "builds/production"))

& node (Join-Path $PSScriptRoot "build-site.mjs")
if ($LASTEXITCODE -ne 0) { throw "No se pudo generar la vista previa." }

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
Get-ChildItem -LiteralPath $sourceDir -Filter "*.html" -Recurse | ForEach-Object {
  $relative = $_.FullName.Substring($sourceDir.Length).TrimStart('\', '/')
  $target = Join-Path $outputDir $relative
  New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
  Copy-Item -LiteralPath $_.FullName -Destination $target -Force
}
Copy-Item -LiteralPath (Join-Path $sourceDir "styles.css") -Destination $outputDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "script.js") -Destination $outputDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "theme.js") -Destination $outputDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "analytics.js") -Destination $outputDir -Force

New-Item -ItemType Directory -Path (Join-Path $outputDir "assets") -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "assets/products") -Destination (Join-Path $outputDir "assets/products") -Recurse -Force

$outputBranding = Join-Path $outputDir "assets/branding"
New-Item -ItemType Directory -Path $outputBranding -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "assets/branding/logos") -Destination $outputBranding -Recurse -Force

$outputSocial = Join-Path $outputBranding "social"
New-Item -ItemType Directory -Path $outputSocial | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "assets/branding/social/axhum-tech-og.png") -Destination $outputSocial -Force

@("favicon.svg", "favicon-512.png", "_headers", "_worker.js", "robots.txt", "sitemap.xml", "llms.txt", "ai-catalog.json") | ForEach-Object {
  Copy-Item -LiteralPath (Join-Path $projectRoot "public/$_") -Destination $outputDir -Force
}

# El catalogo de recursos para agentes se descubre en /.well-known/.
New-Item -ItemType Directory -Path (Join-Path $outputDir ".well-known") -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot "public/ai-catalog.json") -Destination (Join-Path $outputDir ".well-known/ai-catalog.json") -Force

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
$vTheme = & $huella "theme.js"
$vAnalytics = & $huella "analytics.js"

# UTF-8 sin BOM, explicito: Windows PowerShell 5.1 lee/escribe ANSI por defecto
# y eso rompe los acentos de los datos estructurados JSON-LD.
$utf8 = New-Object System.Text.UTF8Encoding($false)

& node (Join-Path $PSScriptRoot 'prepare-production.mjs') $outputDir $vCss $vJs $vTheme $vAnalytics
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron preparar los enlaces de produccion.' }

Write-Host "Build de produccion creado en $outputDir"
