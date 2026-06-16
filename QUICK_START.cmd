@echo off
echo ========================================
echo   Quick Start - Bento Grid 40 Projects
echo ========================================
echo.

echo [1/3] Stopping Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Clearing cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo    - Cleared Vite cache
)
if exist "dist" (
    rmdir /s /q "dist"
    echo    - Cleared dist
)

echo [3/3] Starting dev server...
echo.
echo ========================================
echo   Server starting...
echo ========================================
echo.
echo IMPORTANT:
echo 1. Open browser in INCOGNITO mode (Ctrl+Shift+N)
echo 2. Go to: http://localhost:3000
echo 3. Click "Work" to see 40 projects!
echo.
echo If changes don't appear, press Ctrl+Shift+R
echo ========================================
echo.

npm run dev
