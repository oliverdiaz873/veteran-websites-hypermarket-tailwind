# Script simplificado para reparar caracteres UTF-8 mal codificados

function Fix-EncodingFile {
    param([string]$filePath)
    
    # Crear backup
    $backupPath = $filePath + ".backup"
    Copy-Item -Path $filePath -Destination $backupPath
    Write-Host "Backup creado: $backupPath"
    
    try {
        # Leer archivo
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # Aplicar correcciones básicas
        $originalContent = $content
        $content = $content -replace 'Ã¡', 'á'
        $content = $content -replace 'Ã©', 'é'
        $content = $content -replace 'Ã­', 'í'
        $content = $content -replace 'Ã³', 'ó'
        $content = $content -replace 'Ãº', 'ú'
        $content = $content -replace 'Ã±', 'ñ'
        $content = $content -replace 'Ã', 'í'
        $content = $content -replace 'Â¿', '¿'
        $content = $content -replace 'Â¡', '¡'
        $content = $content -replace 'â€"', '"'
        $content = $content -replace 'â€œ', '"'
        $content = $content -replace 'â€™', "'"
        $content = $content -replace 'â€¦', '...'
        
        # Escribir archivo corregido
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        
        $changes = ($originalContent.Length - $content.Length)
        Write-Host "Archivo procesado: $filePath (Cambios: $changes)"
        
        return $changes
    }
    catch {
        Write-Host "Error procesando $filePath : $($_.Exception.Message)" -ForegroundColor Red
        return 0
    }
}

# Obtener lista de archivos con problemas
Write-Host "Buscando archivos con problemas de codificación..." -ForegroundColor Yellow

$problematicFiles = @()
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $hasIssues = $false
    
    if ($content -match 'Ã¡|Ã©|Ã­|Ã³|Ãº|Ã±|Ã|Â¿|Â¡|â€"|â€œ|â€™|â€¦') {
        $problematicFiles += $file.FullName
    }
}

Write-Host "Se encontraron $($problematicFiles.Count) archivos con problemas" -ForegroundColor Red

if ($problematicFiles.Count -gt 0) {
    $response = Read-Host "¿Desea reparar todos los archivos? (s/n)"
    if ($response.ToLower() -eq 's') {
        $totalChanges = 0
        foreach ($file in $problematicFiles) {
            $changes = Fix-EncodingFile -filePath $file
            $totalChanges += $changes
        }
        
        Write-Host "`n=== RESUMEN ===" -ForegroundColor Green
        Write-Host "Archivos procesados: $($problematicFiles.Count)" -ForegroundColor Green
        Write-Host "Cambios totales: $totalChanges" -ForegroundColor Green
    }
    else {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
    }
}
else {
    Write-Host "No se encontraron problemas de codificación." -ForegroundColor Green
}
