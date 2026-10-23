@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PY="
python --version >nul 2>nul && set "PY=python"
if not defined PY py --version >nul 2>nul && set "PY=py"
if defined PY goto controle
echo Python introuvable : le controle avant envoi est ignore.
goto envoi
:controle
%PY% outils\valider.py
if errorlevel 1 goto echec_controle
:envoi
echo.
echo Fichiers modifies :
git status --short
echo.
set "MSG=Mise a jour"
set /p MSG=Decrivez la modification (Entree = Mise a jour) : 
git add .
git commit -m "%MSG%"
git pull --rebase
if errorlevel 1 goto echec
git push
if errorlevel 1 goto echec
echo.
echo OK : envoye. Verifiez l'onglet Actions sur GitHub : le site se met a jour dans les minutes qui suivent.
pause
exit /b 0
:echec_controle
echo.
echo ECHEC : le controle des projets a trouve des erreurs (voir ci-dessus). RIEN n'a ete envoye.
pause
exit /b 1
:echec
echo.
echo ECHEC : l'envoi vers GitHub a ete refuse ou a echoue (voir ci-dessus). Le site n'est PAS a jour.
pause
exit /b 1
