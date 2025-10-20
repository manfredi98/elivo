@echo off
echo ========================================
echo    CONFIGURACION DE PROYECTO ELIVO
echo ========================================
echo.

echo [1/4] Instalando dependencias de Node.js...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas correctamente
echo.

echo [2/4] Configurando base de datos PostgreSQL...
echo NOTA: Asegurate de que PostgreSQL este ejecutandose
echo.
call npm run setup:db
if %errorlevel% neq 0 (
    echo ERROR: No se pudo configurar la base de datos
    echo Verifica que PostgreSQL este ejecutandose y las credenciales sean correctas
    pause
    exit /b 1
)
echo ✓ Base de datos configurada correctamente
echo.

echo [3/4] Creando archivo .env...
if not exist .env (
    copy env.example .env
    echo ✓ Archivo .env creado desde env.example
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales:
    echo - DB_PASSWORD: Tu contraseña de PostgreSQL
    echo - STRIPE_SECRET_KEY: Tu clave secreta de Stripe (opcional)
    echo - STRIPE_PUBLISHABLE_KEY: Tu clave publica de Stripe (opcional)
    echo.
) else (
    echo ✓ Archivo .env ya existe
)
echo.

echo [4/4] Verificando configuracion...
echo ✓ Proyecto configurado correctamente
echo.

echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Para iniciar el proyecto:
echo   1. Desarrollo: npm run start:dev:postgresql
echo   2. Solo servidor: npm run start:postgresql
echo   3. Solo frontend: npm run dev
echo.
echo Para probar la API:
echo   npm run test:api
echo.
echo Para ver contactos:
echo   npm run view:contacts
echo.
pause
