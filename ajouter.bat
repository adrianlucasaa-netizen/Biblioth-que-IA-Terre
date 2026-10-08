@echo off
chcp 65001 >nul
cd /d "%~dp0"
if "%~1"=="" (
  echo Glissez un fichier proposition-xxx.json sur ce fichier ajouter.bat.
  pause
  exit /b 1
)
set PY=python
where python >nul 2>&1 || set PY=py
%PY% outils\importer.py "%~1" --demander
echo.
pause
