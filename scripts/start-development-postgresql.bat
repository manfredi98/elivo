@echo off
echo ========================================
echo    ELIVO - MODO DESARROLLO (PostgreSQL)
echo ========================================
echo.

echo Paso 1: Configurando base de datos...
call npm run setup:db
if errorlevel 1 (
    echo ❌ Error al configurar la base de datos
    echo 💡 Verifica que PostgreSQL esté ejecutándose
    echo 💡 O usa: scripts/start-development.bat (modo memoria)
    pause
    exit /b 1
)

echo.
echo Paso 2: Iniciando servidor y frontend...
echo ✅ Backend: http://localhost:3000 (PostgreSQL)
echo ✅ Frontend: http://localhost:5173
echo.
call npm run start:dev:postgresql

