@echo off
setlocal
cd /d "%~dp0"
title MMA : RPG Launcher
color 0A

echo ========================================
echo          MMA : RPG - Launcher
echo ========================================
echo.

set "PYTHON="
where py >nul 2>nul && set "PYTHON=py"
if not defined PYTHON where python >nul 2>nul && set "PYTHON=python"

if not defined PYTHON (
  echo [ERROR] Python 3 was not found.
  echo Install Python from https://www.python.org/downloads/
  echo Then double-click run.bat again.
  pause
  exit /b 1
)

echo Starting MMA : RPG local server...
echo Game: http://localhost:8000
echo.
start "MMA RPG Browser" cmd /c "timeout /t 1 /nobreak ^>nul ^& start http://localhost:8000"
echo Server is running. Close this window to stop it.
echo.
%PYTHON% -m http.server 8000

if errorlevel 1 (
  echo.
  echo [ERROR] Server could not start. Port 8000 may already be in use.
  pause
)
endlocal