@echo off
echo ========================================
echo    ELIVO - MODO PRODUCCION
echo ========================================
echo.

echo Paso 1: Construyendo aplicacion...
call npm run build
if errorlevel 1 (
    echo ❌ Error al construir la aplicacion
    pause
    exit /b 1
)

echo.
echo Paso 2: Configurando base de datos...
call npm run setup:db
if errorlevel 1 (
    echo ❌ Error al configurar la base de datos
    echo 💡 Verifica que PostgreSQL esté ejecutándose
    pause
    exit /b 1
)

echo.
echo Paso 3: Iniciando servidor de produccion...
echo ✅ Aplicacion lista en http://localhost:3000
echo.
call npm start

