# Script para reparar caracteres UTF-8 mal codificados en archivos HTML
# Autor: Sistema de reparación de codificación

# Mapeo de caracteres mal codificados a caracteres correctos
$characterMap = @{
    'Ã¡' = 'á'
    'Ã©' = 'é' 
    'Ã­' = 'í'
    'Ã³' = 'ó'
    'Ãº' = 'ú'
    'Ã±' = 'ñ'
    'Ã' = 'Í'
    'Ã' = 'Á'
    'Ã' = 'É'
    'Ã' = 'Í'
    'Ã' = 'Ó'
    'Ã' = 'Ú'
    'Ã' = 'Ñ'
    'Â¿' = '¿'
    'Â¡' = '¡'
    'Â«' = '«'
    'Â»' = '»'
    'â€"' = '"'
    'â€œ' = '"'
    'â€™' = "'"
    'â€¦' = '...'
    'â€“' = '–'
    'â€"' = '—'
}

function Detect-EncodingIssues {
    param([string]$directory)
    
    $problematicFiles = @()
    $htmlFiles = Get-ChildItem -Path $directory -Filter "*.html" -Recurse
    
    foreach ($file in $htmlFiles) {
        try {
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            
            $issuesFound = 0
            foreach ($brokenChar in $characterMap.Keys) {
                $issuesFound += ($content | Select-String -Pattern $brokenChar -AllMatches).Matches.Count
            }
            
            if ($issuesFound -gt 0) {
                $problematicFiles += @{
                    File = $file.FullName
                    Issues = $issuesFound
                }
            }
        }
        catch {
            Write-Host "Error reading $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    return $problematicFiles
}

function Fix-EncodingIssues {
    param(
        [string]$filePath,
        [bool]$backup = $true
    )
    
    # Crear backup
    if ($backup) {
        $backupPath = $filePath + ".backup"
        Copy-Item -Path $filePath -Destination $backupPath
        Write-Host "Backup creado: $backupPath" -ForegroundColor Green
    }
    
    try {
        # Leer archivo
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # Contar problemas antes de la corrección
        $originalIssues = 0
        foreach ($brokenChar in $characterMap.Keys) {
            $originalIssues += ($content | Select-String -Pattern $brokenChar -AllMatches).Matches.Count
        }
        
        # Aplicar correcciones
        $fixedContent = $content
        foreach ($brokenChar in $characterMap.Keys) {
            $fixedContent = $fixedContent -replace [regex]::Escape($brokenChar), $characterMap[$brokenChar]
        }
        
        # Contar problemas después de la corrección
        $remainingIssues = 0
        foreach ($brokenChar in $characterMap.Keys) {
            $remainingIssues += ($fixedContent | Select-String -Pattern $brokenChar -AllMatches).Matches.Count
        }
        
        # Escribir archivo corregido
        Set-Content -Path $filePath -Value $fixedContent -Encoding UTF8
        
        Write-Host "Archivo: $filePath" -ForegroundColor Cyan
        Write-Host "  Problemas encontrados: $originalIssues" -ForegroundColor Yellow
        Write-Host "  Problemas restantes: $remainingIssues" -ForegroundColor Yellow
        Write-Host "  Correcciones aplicadas: $($originalIssues - $remainingIssues)" -ForegroundColor Green
        Write-Host ""
        
        return ($originalIssues - $remainingIssues)
    }
    catch {
        Write-Host "Error fixing $filePath : $($_.Exception.Message)" -ForegroundColor Red
        return 0
    }
}

# Ejecución principal
$projectDir = "c:\Users\dell\Desktop\veteran-websites-hypermarket-tailwind"

Write-Host "=== DETECCIÓN DE PROBLEMAS DE CODIFICACIÓN ===" -ForegroundColor Magenta
$problematicFiles = Detect-EncodingIssues -directory $projectDir

Write-Host "`nSe encontraron $($problematicFiles.Count) archivos con problemas:" -ForegroundColor Yellow
$totalIssues = 0
foreach ($fileInfo in $problematicFiles) {
    Write-Host "  $($fileInfo.File): $($fileInfo.Issues) problemas" -ForegroundColor White
    $totalIssues += $fileInfo.Issues
}

Write-Host "`nTotal de problemas: $totalIssues" -ForegroundColor Red

if ($problematicFiles.Count -gt 0) {
    Write-Host "`n=== REPARACIÓN DE ARCHIVOS ===" -ForegroundColor Magenta
    
    # Confirmar ejecución
    $response = Read-Host "¿Desea reparar todos los archivos? (s/n)"
    if ($response.ToLower() -eq 's') {
        $totalFixes = 0
        foreach ($fileInfo in $problematicFiles) {
            $fixes = Fix-EncodingIssues -filePath $fileInfo.File
            $totalFixes += $fixes
        }
        
        Write-Host "`n=== RESUMEN ===" -ForegroundColor Magenta
        Write-Host "Archivos procesados: $($problematicFiles.Count)" -ForegroundColor Green
        Write-Host "Correcciones totales: $totalFixes" -ForegroundColor Green
    }
    else {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
    }
}
else {
    Write-Host "No se encontraron problemas de codificación." -ForegroundColor Green
}

Write-Host "`nPresione Enter para continuar..."
Read-Host
