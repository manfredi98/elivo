@echo off
echo Instalando dependencias del servidor...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependencias
echo Instalando paquetes de Node.js...
npm install express cors body-parser sqlite3 nodemailer

echo.
echo Inicializando base de datos...
node init-db.js

echo.
echo ✅ Instalación completada!
echo.
echo Para iniciar el servidor, ejecuta:
echo   node server.js
echo.
echo O usa el archivo: start-server.bat
echo.
pause

