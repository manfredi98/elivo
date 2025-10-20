@echo off
echo 🚀 Iniciando servidor de desarrollo con PostgreSQL...
echo.
echo 📊 Servidor: http://localhost:3000
echo 🌐 Frontend: http://localhost:5173
echo.
start "Servidor Backend" cmd /k "cd /d %~dp0.. && npm run start:postgresql"
timeout /t 3 /nobreak >nul
start "Frontend Vite" cmd /k "cd /d %~dp0.. && npm run dev"
echo.
echo ✅ Servidores iniciados correctamente
echo.
echo 📋 URLs disponibles:
echo    - API Test: http://localhost:3000/api/test
echo    - Productos: http://localhost:3000/api/productos
echo    - Contacto: POST http://localhost:3000/api/contacto
echo.
pause
