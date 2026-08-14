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

@("favicon.svg", "favicon-512.png", "_headers", "robots.txt", "sitemap.xml") | ForEach-Object {
  Copy-Item -LiteralPath (Join-Path $projectRoot "public/$_") -Destination $outputDir -Force
}

Get-ChildItem -LiteralPath $outputDir -Filter "*.html" | ForEach-Object {
  $html = Get-Content -LiteralPath $_.FullName -Raw
  $html = $html.Replace("../../assets/", "./assets/")
  $html = $html.Replace("../../public/", "./")
  Set-Content -LiteralPath $_.FullName -Value $html -Encoding utf8
}

Write-Host "Build de produccion creado en $outputDir"
