@echo off
echo Iniciando servidor de Elivo...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo Las dependencias no están instaladas.
    echo Ejecutando instalación automática...
    call install-server.bat
)

REM Iniciar servidor
echo 🚀 Iniciando servidor en http://localhost:3000
echo 📧 Formulario de contacto: http://localhost:3000/contacto
echo 👥 Página nosotros: http://localhost:3000/nosotros
echo 🔧 Panel admin: http://localhost:3000/admin
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

node server.js

