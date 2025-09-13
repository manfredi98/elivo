@echo off
echo Configurando entorno...
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

echo Verificando Node.js...
"%NODE_PATH%\node.exe" --version

echo Verificando npm...
"%NODE_PATH%\npm.cmd" --version

echo Iniciando servidor de desarrollo...
cd /d "%~dp0"
"%NODE_PATH%\npm.cmd" run dev

