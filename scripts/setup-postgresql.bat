@echo off
echo ========================================
echo    CONFIGURACION DE POSTGRESQL
echo ========================================
echo.

echo Paso 1: Verificando archivo .env...
if not exist .env (
    echo ❌ Archivo .env no encontrado
    echo 💡 Copiando desde env.example...
    copy env.example .env
    echo.
    echo ⚠️  IMPORTANTE: Edita el archivo .env y configura tu contraseña de PostgreSQL
    echo    Cambia: DB_PASSWORD=tu_password_postgres
    echo    Por:    DB_PASSWORD=TU_CONTRASEÑA_REAL
    echo.
    pause
)

echo Paso 2: Configurando base de datos...
call npm run setup:db
if errorlevel 1 (
    echo.
    echo ❌ Error al configurar la base de datos
    echo 💡 Verifica que:
    echo    - PostgreSQL esté ejecutándose
    echo    - Las credenciales en .env sean correctas
    echo.
    pause
    exit /b 1
)

echo.
echo Paso 3: Iniciando servidor PostgreSQL...
echo ✅ Base de datos configurada correctamente
echo 🚀 Iniciando servidor...
echo.
start "Servidor PostgreSQL" cmd /k "npm run server:postgresql"

echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Para ver contactos: npm run view:contacts
echo.
pause

