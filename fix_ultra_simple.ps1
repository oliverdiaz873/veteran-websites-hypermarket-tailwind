# Script ultra simplificado para reparar caracteres UTF-8

# Lista de archivos a reparar (basado en el análisis anterior)
$filesToFix = @(
    "pages\category\ropa.html",
    "pages\product\ropa\vestidos\vestido_negro.html",
    "pages\product\ropa\trajes_para_hombres\traje_2piezas.html",
    "pages\product\ropa\trajes_para_hombres\traje_completo.html",
    "pages\product\ropa\vestidos\vestido_ajustado.html",
    "pages\product\tecnologia\televisores\televisor_led_50.html",
    "pages\product\tecnologia\televisores\tv_samsung_75.html",
    "pages\product\ropa\trajes_para_hombres\traje_negro.html",
    "pages\product\ropa\vestidos\vestido_de_invierno.html",
    "pages\product\tecnologia\celulares\celular_a26.html",
    "pages\product\tecnologia\celulares\celular_a35.html",
    "pages\product\tecnologia\laptops\laptop_asus.html",
    "pages\product\tecnologia\tablets\tablet_apple.html",
    "pages\product\tecnologia\televisores\televisor_samsung_led.html",
    "pages\product\ropa\trajes_para_hombres\traje_elegante.html",
    "pages\product\ropa\vestidos\vestido_de_cuello_cuadrado.html",
    "pages\product\ropa\vestidos\vestido_elegante.html",
    "pages\product\tecnologia\celulares\iphone_14.html",
    "pages\product\tecnologia\celulares\iphone_14pro.html",
    "pages\product\tecnologia\laptops\laptop_dragonx.html",
    "pages\product\tecnologia\laptops\laptop_hp.html",
    "pages\product\tecnologia\laptops\laptop_lenovo.html",
    "pages\product\tecnologia\tablets\tablet_tecnomaster.html",
    "pages\product\ropa\trajes_para_hombres\traje_azul.html",
    "pages\product\tecnologia\bocinas\bocina_stage.html",
    "pages\product\tecnologia\celulares\celular_s24.html",
    "pages\product\tecnologia\laptops\laptop_dell.html",
    "pages\product\tecnologia\tablets\tablet_rted.html",
    "pages\product\tecnologia\tablets\tablet_samsung.html",
    "pages\product\tecnologia\tablets\tablet_tcl.html",
    "pages\product\tecnologia\televisores\televisor_lg.html",
    "pages\product\tecnologia\televisores\televisor_tecnomaster.html",
    "pages\product\tecnologia\bocinas\bocina_aiwa.html",
    "pages\product\tecnologia\bocinas\bocina_samsung.html",
    "pages\product\tecnologia\bocinas\bocina_tecnomaster.html",
    "pages\product\tecnologia\bocinas\bocina_lg.html",
    "pages\product\ropa\pantalones_para_ninos\licra_para_ninos.html",
    "pages\product\ropa\pantalones_para_ninos\jean_para_ninos.html",
    "pages\product\ropa\pantalones_para_ninos\pantalon_deportivo.html",
    "pages\product\ropa\pantalones_para_ninos\pantalones_lisos.html",
    "pages\product\ropa\pantalones_para_ninos\pantalon_liso.html",
    "pages\category\tecnologia.html"
)

Write-Host "=== INICIANDO REPARACIÓN DE ARCHIVOS ===" -ForegroundColor Green
Write-Host "Se procesaran $($filesToFix.Count) archivos" -ForegroundColor Yellow

$response = Read-Host "¿Desea continuar? (s/n)"
if ($response.ToLower() -ne 's') {
    Write-Host "Operación cancelada." -ForegroundColor Red
    exit
}

$totalFixes = 0

foreach ($file in $filesToFix) {
    $fullPath = Join-Path -Path "." -ChildPath $file
    
    if (Test-Path $fullPath) {
        # Crear backup
        $backupPath = $fullPath + ".backup"
        Copy-Item -Path $fullPath -Destination $backupPath
        
        # Leer y procesar archivo
        try {
            $content = Get-Content -Path $fullPath -Raw -Encoding UTF8
            
            # Contar problemas antes
            $beforeIssues = 0
            $beforeIssues += ($content | Select-String -Pattern 'Ã¡' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ã©' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ã­' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ã³' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ãº' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ã±' -AllMatches).Matches.Count
            $beforeIssues += ($content | Select-String -Pattern 'Ã' -AllMatches).Matches.Count
            
            # Aplicar correcciones
            $content = $content -replace 'Ã¡', 'á'
            $content = $content -replace 'Ã©', 'é'
            $content = $content -replace 'Ã­', 'í'
            $content = $content -replace 'Ã³', 'ó'
            $content = $content -replace 'Ãº', 'ú'
            $content = $content -replace 'Ã±', 'ñ'
            $content = $content -replace 'Ã', 'í'
            
            # Guardar archivo corregido
            Set-Content -Path $fullPath -Value $content -Encoding UTF8
            
            Write-Host "Procesado: $file (Problemas: $beforeIssues)" -ForegroundColor Cyan
            $totalFixes += $beforeIssues
            
        } catch {
            Write-Host "Error procesando $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Archivo no encontrado: $fullPath" -ForegroundColor Yellow
    }
}

Write-Host "`n=== RESUMEN FINAL ===" -ForegroundColor Green
Write-Host "Archivos procesados: $($filesToFix.Count)" -ForegroundColor Green
Write-Host "Correcciones totales: $totalFixes" -ForegroundColor Green
Write-Host "¡Reparación completada!" -ForegroundColor Green
