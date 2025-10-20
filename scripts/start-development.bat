@echo off
echo ========================================
echo    ELIVO - MODO DESARROLLO
echo ========================================
echo.

echo Paso 1: Iniciando servidor y frontend...
echo ✅ Backend: http://localhost:3000 (Modo Memoria)
echo ✅ Frontend: http://localhost:5173
echo.
echo 💡 Nota: Usando modo memoria (sin PostgreSQL)
echo 💡 Para usar PostgreSQL: scripts/start-development-postgresql.bat
echo.
call npm run start:dev
