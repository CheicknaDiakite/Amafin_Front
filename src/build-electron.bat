@echo off
title Build Electron App - DiakiteDigital
echo =================================================
echo   PREPARATION DU BUILD ELECTRON
echo =================================================

:: 1. Désactiver les variables de proxy
echo [1/5] Désactivation des variables de proxy...
set HTTP_PROXY=
set HTTPS_PROXY=
set NO_PROXY=localhost,127.0.0.1

:: 2. Créer les dossiers de cache nécessaires
echo [2/5] Création des dossiers de cache si absents...

setlocal

set "USERDIR=%USERPROFILE%"
set "ELECTRON_CACHE=%USERDIR%\AppData\Local\electron\Cache"
set "WINCODESIGN_CACHE=%USERDIR%\AppData\Local\electron-builder\winCodeSign"
set "NSIS_CACHE=%USERDIR%\AppData\Local\electron-builder\nsis"

mkdir "%ELECTRON_CACHE%" >nul 2>&1
mkdir "%WINCODESIGN_CACHE%" >nul 2>&1
mkdir "%NSIS_CACHE%" >nul 2>&1

echo [3/5] Vérification des fichiers requis...

if not exist "%ELECTRON_CACHE%\electron-v37.2.1-win32-x64.zip" (
  echo ❌ electron-v37.2.1-win32-x64.zip est manquant dans %ELECTRON_CACHE%
) else (
  echo ✅ electron-v37.2.1-win32-x64.zip trouvé.
)

if not exist "%WINCODESIGN_CACHE%\winCodeSign-2.6.0.7z" (
  echo ❌ winCodeSign-2.6.0.7z est manquant dans %WINCODESIGN_CACHE%
) else (
  echo ✅ winCodeSign-2.6.0.7z trouvé.
)

if not exist "%NSIS_CACHE%\nsis-3.0.4.1.7z" (
  echo ❌ nsis-3.0.4.1.7z est manquant dans %NSIS_CACHE%
) else (
  echo ✅ nsis-3.0.4.1.7z trouvé.
)

:: 4. Lancer le build
echo [4/5] Lancement du build Electron...
cd /d "%~dp0"
pnpm exec electron-builder --win --x64

:: 5. Terminé
echo =================================================
echo   ✅ BUILD TERMINÉ
echo =================================================
pause
