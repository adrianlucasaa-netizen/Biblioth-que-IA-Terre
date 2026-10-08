@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Fichiers modifies :
git status --short
echo.
set "MSG=Mise a jour"
set /p MSG=Decrivez la modification (Entree = Mise a jour) : 
git add .
git commit -m "%MSG%"
git push
echo.
echo Termine. Verifiez l'onglet Actions sur GitHub : le site se met a jour en 1 a 2 minutes.
pause
