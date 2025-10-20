@echo off
echo ========================================
echo    CONFIGURACION AUTOMATICA ELIVO
echo ========================================
echo.

echo Paso 1: Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo Paso 2: Creando archivo .env...
if not exist .env (
    copy env.example .env
    echo ✅ Archivo .env creado
    echo ⚠️  IMPORTANTE: Edita .env con tus credenciales de PostgreSQL
) else (
    echo ℹ️  Archivo .env ya existe
)

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo ✅ Proyecto listo para usar
echo.
echo OPCIONES:
echo.
echo 1. Desarrollo (sin PostgreSQL):
echo    scripts/start-development.bat
echo.
echo 2. Desarrollo (con PostgreSQL):
echo    scripts/start-development-postgresql.bat
echo    (Requiere PostgreSQL instalado)
echo.
echo 3. Producción:
echo    scripts/start-production.bat
echo.
echo 💡 Recomendado: Usa la opción 1 para empezar
echo.
pause
