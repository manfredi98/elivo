1@echo off
echo ========================================
echo    INSTALADOR DE BASES DE DATOS
echo ========================================
echo.

echo Selecciona la base de datos que quieres usar:
echo.
echo 1. MySQL (Recomendada para producción)
echo 2. PostgreSQL (Muy potente)
echo 3. MongoDB (NoSQL - Flexible)
echo 4. SQLite (Simple - Ya funcionando)
echo.

set /p choice="Ingresa tu opción (1-4): "

if "%choice%"=="1" goto mysql
if "%choice%"=="2" goto postgresql
if "%choice%"=="3" goto mongodb
if "%choice%"=="4" goto sqlite
goto invalid

:mysql
echo.
echo Instalando dependencias para MySQL...
"C:\Program Files\nodejs\npm.cmd" install mysql2
echo.
echo ✅ MySQL configurado!
echo.
echo Para usar MySQL:
echo 1. Instala MySQL Server desde: https://dev.mysql.com/downloads/
echo 2. Crea una base de datos llamada 'elivo_contacts'
echo 3. Ejecuta: node server-mysql.cjs
echo.
goto end

:postgresql
echo.
echo Instalando dependencias para PostgreSQL...
"C:\Program Files\nodejs\npm.cmd" install pg
echo.
echo ✅ PostgreSQL configurado!
echo.
echo Para usar PostgreSQL:
echo 1. Instala PostgreSQL desde: https://www.postgresql.org/download/
echo 2. Crea una base de datos llamada 'elivo_contacts'
echo 3. Ejecuta: node server-postgresql.cjs
echo.
goto end

:mongodb
echo.
echo Instalando dependencias para MongoDB...
"C:\Program Files\nodejs\npm.cmd" install mongodb
echo.
echo ✅ MongoDB configurado!
echo.
echo Para usar MongoDB:
echo 1. Instala MongoDB desde: https://www.mongodb.com/try/download/community
echo 2. Inicia el servicio de MongoDB
echo 3. Ejecuta: node server-mongodb.cjs
echo.
goto end

:sqlite
echo.
echo ✅ SQLite ya está funcionando!
echo.
echo Para usar SQLite (actual):
echo Ejecuta: node server.cjs
echo.
goto end

:invalid
echo.
echo ❌ Opción inválida. Por favor selecciona 1, 2, 3 o 4.
echo.
goto end

:end
echo.
echo ========================================
echo    INSTALACIÓN COMPLETADA
echo ========================================
echo.
pause
2