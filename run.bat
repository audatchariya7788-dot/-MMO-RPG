@echo off
cd /d "%~dp0"
echo Starting MMA : RPG...
where py >nul 2>nul && (start "MMA RPG Server" cmd /k "py -m http.server 8000") || (start "MMA RPG Server" cmd /k "python -m http.server 8000")
timeout /t 2 >nul
start http://localhost:8000
