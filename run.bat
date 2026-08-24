@echo off
setlocal
cd /d "%~dp0"

title MMA : RPG Launcher

echo ========================================
echo          MMA : RPG - Launcher
echo ========================================
echo.

where python >nul 2>nul
if %errorlevel%==0 goto START_PYTHON

where py >nul 2>nul
if %errorlevel%==0 goto START_PY

echo [ERROR] Python was not found.
echo.
echo Please install Python 3, then double-click run.bat again.
echo https://www.python.org/downloads/
echo.
pause
exit /b 1

:START_PYTHON
if exist python.exe set "PYTHON=python"
if not defined PYTHON if exist py.exe set "PYTHON=py"
if not defined PYTHON where python >nul 2>nul && set "PYTHON=python"
if not defined PYTHON set "PYTHON=py"

echo Starting local game server...
echo.
echo Game URL: http://localhost:8000

echo Opening browser in 2 seconds...
start "MMA RPG Browser" cmd /c "timeout /t 2 >nul & start http://localhost:8000"
echo.
echo Server is running.
echo Close this window to stop the game server.
echo.
%PYTHON% -m http.server 8000

if errorlevel 1 (
    echo.
    echo [ERROR] Could not start the local server.
    echo Make sure port 8000 is not already in use.
    echo.
    pause
)
endlocal
