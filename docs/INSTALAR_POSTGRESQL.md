# 🐘 Guía para Instalar PostgreSQL

## 📥 Descargar PostgreSQL

1. **Ve a la página oficial**: https://www.postgresql.org/download/windows/
2. **Descarga el instalador** para Windows
3. **Ejecuta el instalador** como administrador

## ⚙️ Instalación Paso a Paso

### 1. **Ejecutar el Instalador**
- Haz doble clic en el archivo descargado
- Selecciona "Yes" para permitir cambios

### 2. **Configuración Inicial**
- **Port**: 5432 (por defecto)
- **Superuser Password**: Crea una contraseña segura (¡anótala!)
- **Locale**: Spanish, Chile

### 3. **Componentes a Instalar**
- ✅ PostgreSQL Server
- ✅ pgAdmin 4 (interfaz gráfica)
- ✅ Stack Builder
- ✅ Command Line Tools

### 4. **Finalizar Instalación**
- Completa la instalación
- **NO** ejecutar Stack Builder por ahora

## 🔧 Configurar PostgreSQL

### 1. **Iniciar el Servicio**
- Presiona `Win + R`
- Escribe `services.msc`
- Busca "postgresql-x64-XX"
- Click derecho → "Start" (si no está iniciado)

### 2. **Verificar Instalación**
```bash
# Abrir Command Prompt
psql --version
```

### 3. **Conectar por Primera Vez**
```bash
# Conectar como superusuario
psql -U postgres

# En psql, crear usuario si es necesario
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
CREATE DATABASE elivo_contacts OWNER tu_usuario;
GRANT ALL PRIVILEGES ON DATABASE elivo_contacts TO tu_usuario;
\q
```

## 🔑 Configurar el Proyecto

### 1. **Editar archivo .env**
```env
# Configuración del Servidor
PORT=3000

# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=elivo_contacts
DB_PORT=5432

# Frontend
VITE_API_URL=http://localhost:3000
```

### 2. **Probar Conexión**
```bash
# Configurar base de datos
npm run setup:db

# Si funciona, verás:
# ✅ Base de datos 'elivo_contacts' creada exitosamente
# ✅ Tabla "contactos" creada exitosamente
```

## 🚀 Usar con PostgreSQL

### Desarrollo con PostgreSQL:
```bash
scripts/start-development-postgresql.bat
```

### Ver contactos en PostgreSQL:
```bash
# Opción 1: Script
npm run view:contacts

# Opción 2: psql
psql -U postgres -d elivo_contacts
SELECT * FROM contactos ORDER BY fechaRegistro DESC;
```

## 🛠️ Solución de Problemas

### Error: "No se puede conectar a PostgreSQL"
1. **Verificar que el servicio esté ejecutándose**:
   - `services.msc` → Buscar "postgresql" → Start

2. **Verificar credenciales en .env**:
   - Usuario y contraseña correctos

3. **Verificar puerto**:
   - Por defecto es 5432

### Error: "Authentication failed"
1. **Contraseña incorrecta** en .env
2. **Usuario no existe** - crear con pgAdmin

### Error: "Database does not exist"
1. **Ejecutar**: `npm run setup:db`
2. **O crear manualmente**:
   ```sql
   CREATE DATABASE elivo_contacts;
   ```

## 📊 pgAdmin (Interfaz Gráfica)

### 1. **Abrir pgAdmin**
- Busca "pgAdmin 4" en el menú inicio
- Abre en el navegador

### 2. **Conectar al Servidor**
- Click derecho en "Servers" → "Create" → "Server"
- **Name**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: tu contraseña

### 3. **Ver Base de Datos**
- Navega a: `Servers > PostgreSQL > Databases > elivo_contacts`
- Click derecho en "Tables" → "Refresh"
- Ver tabla "contactos"

## ✅ Verificar que Todo Funciona

```bash
# 1. Configurar proyecto
scripts/setup-project.bat

# 2. Iniciar con PostgreSQL
scripts/start-development-postgresql.bat

# 3. Probar en navegador
# http://localhost:5173

# 4. Enviar formulario de contacto

# 5. Verificar en base de datos
npm run view:contacts
```

## 🎯 Alternativa: Usar Modo Memoria

Si no quieres instalar PostgreSQL ahora:

```bash
# Usar modo memoria (sin base de datos)
scripts/start-development.bat
```

**Nota**: Los contactos se guardan en memoria y se pierden al reiniciar el servidor.

---

**¡Con PostgreSQL tendrás persistencia de datos y todas las funcionalidades completas!** 🚀

