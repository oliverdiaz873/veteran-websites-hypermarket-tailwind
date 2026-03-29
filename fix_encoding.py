#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para detectar y reparar caracteres UTF-8 mal codificados en archivos HTML
"""

import os
import re
import shutil
from pathlib import Path

# Mapeo de caracteres mal codificados a caracteres correctos
CHARACTER_MAP = {
    'Ã¡': 'á',
    'Ã©': 'é', 
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã': 'í',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã': 'Í',
    'Ã': 'Á',
    'Ã': 'É',
    'Ã': 'Í',
    'Ã': 'Ó',
    'Ã': 'Ú',
    'Ã': 'Ñ',
    'Â¿': '¿',
    'Â¡': '¡',
    'Â«': '«',
    'Â»': '»',
    'â€"': '"',
    'â€œ': '"',
    'â€™': "'",
    'â€¦': '...',
    'â€“': '–',
    'â€”': '—',
}

def detect_encoding_issues(directory):
    """Detecta archivos con problemas de codificación"""
    problematic_files = []
    directory = Path(directory)
    
    # Buscar todos los archivos HTML
    html_files = list(directory.rglob("*.html"))
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Buscar caracteres problemáticos
            issues_found = 0
            for broken_char in CHARACTER_MAP.keys():
                issues_found += content.count(broken_char)
            
            if issues_found > 0:
                problematic_files.append({
                    'file': str(file_path),
                    'issues': issues_found
                })
                
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    return problematic_files

def fix_encoding_issues(file_path, backup=True):
    """Repara caracteres mal codificados en un archivo"""
    file_path = Path(file_path)
    
    # Crear backup
    if backup:
        backup_path = file_path.with_suffix(file_path.suffix + '.backup')
        shutil.copy2(file_path, backup_path)
        print(f"Backup creado: {backup_path}")
    
    try:
        # Leer archivo
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Contar problemas antes de la corrección
        original_issues = 0
        for broken_char in CHARACTER_MAP.keys():
            original_issues += content.count(broken_char)
        
        # Aplicar correcciones
        fixed_content = content
        for broken_char, correct_char in CHARACTER_MAP.items():
            fixed_content = fixed_content.replace(broken_char, correct_char)
        
        # Contar problemas después de la corrección
        remaining_issues = 0
        for broken_char in CHARACTER_MAP.keys():
            remaining_issues += fixed_content.count(broken_char)
        
        # Escribir archivo corregido
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"Archivo: {file_path}")
        print(f"  Problemas encontrados: {original_issues}")
        print(f"  Problemas restantes: {remaining_issues}")
        print(f"  Correcciones aplicadas: {original_issues - remaining_issues}")
        print()
        
        return original_issues - remaining_issues
        
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return 0

def main():
    project_dir = r"c:\Users\dell\Desktop\veteran-websites-hypermarket-tailwind"
    
    print("=== DETECCIÓN DE PROBLEMAS DE CODIFICACIÓN ===")
    problematic_files = detect_encoding_issues(project_dir)
    
    print(f"\nSe encontraron {len(problematic_files)} archivos con problemas:")
    total_issues = 0
    for file_info in problematic_files:
        print(f"  {file_info['file']}: {file_info['issues']} problemas")
        total_issues += file_info['issues']
    
    print(f"\nTotal de problemas: {total_issues}")
    
    if problematic_files:
        print("\n=== REPARACIÓN DE ARCHIVOS ===")
        
        # Preguntar si desea continuar
        response = input("¿Desea reparar todos los archivos? (s/n): ")
        if response.lower() == 's':
            total_fixes = 0
            for file_info in problematic_files:
                fixes = fix_encoding_issues(file_info['file'])
                total_fixes += fixes
            
            print(f"\n=== RESUMEN ===")
            print(f"Archivos procesados: {len(problematic_files)}")
            print(f"Correcciones totales: {total_fixes}")
        else:
            print("Operación cancelada.")
    else:
        print("No se encontraron problemas de codificación.")

if __name__ == "__main__":
    main()
