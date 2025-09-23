# 🗄️ Configuración de Bases de Datos - Elivo

## 📋 Opciones Disponibles

### 1. **SQLite (Actual - Funcionando)**
- ✅ **Ya configurado y funcionando**
- 📁 Almacena datos en `contacts.json`
- 🚀 **Para empezar**: `node server.cjs`

### 2. **MySQL (Recomendada para Producción)**
- 🏢 **Ideal para empresas y producción**
- 🔒 **Muy segura y confiable**
- 📊 **Excelente rendimiento**

#### Instalación MySQL:
```bash
# 1. Descargar MySQL desde: https://dev.mysql.com/downloads/
# 2. Instalar MySQL Server
# 3. Crear base de datos:
mysql -u root -p
CREATE DATABASE elivo_contacts;
exit

# 4. Instalar dependencias:
npm install mysql2

# 5. Ejecutar servidor:
node server-mysql.cjs
```

### 3. **PostgreSQL (Muy Potente)**
- 🚀 **Excelente para aplicaciones complejas**
- 🔧 **Muy flexible y escalable**
- 📈 **Ideal para análisis de datos**

#### Instalación PostgreSQL:
```bash
# 1. Descargar PostgreSQL desde: https://www.postgresql.org/download/
# 2. Instalar PostgreSQL
# 3. Crear base de datos:
psql -U postgres
CREATE DATABASE elivo_contacts;
\q

# 4. Instalar dependencias:
npm install pg

# 5. Ejecutar servidor:
node server-postgresql.cjs
```

### 4. **MongoDB (NoSQL - Flexible)**
- 🎯 **Perfecto para datos no estructurados**
- 🔄 **Muy flexible y escalable**
- 📱 **Ideal para aplicaciones modernas**

#### Instalación MongoDB:
```bash
# 1. Descargar MongoDB desde: https://www.mongodb.com/try/download/community
# 2. Instalar MongoDB
# 3. Iniciar servicio MongoDB

# 4. Instalar dependencias:
npm install mongodb

# 5. Ejecutar servidor:
node server-mongodb.cjs
```

## 🚀 Instalación Rápida

### Opción 1: Script Automático
```bash
# Ejecutar el instalador interactivo
install-databases.bat
```

### Opción 2: Manual
```bash
# Para MySQL
npm install mysql2
node server-mysql.cjs

# Para PostgreSQL
npm install pg
node server-postgresql.cjs

# Para MongoDB
npm install mongodb
node server-mongodb.cjs

# Para SQLite (actual)
node server.cjs
```

## 🔧 Configuración de Variables de Entorno

Crea un archivo `.env` basado en `env.example`:

```env
# Para MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=elivo_contacts
DB_PORT=3306

# Para PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=elivo_contacts
DB_PORT=5432

# Para MongoDB
MONGODB_URI=mongodb://localhost:27017
DB_NAME=elivo_contacts
```

## 📊 Comparación de Bases de Datos

| Característica | SQLite | MySQL | PostgreSQL | MongoDB |
|----------------|--------|-------|------------|---------|
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Rendimiento** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Escalabilidad** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Seguridad** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibilidad** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Costo** | Gratis | Gratis | Gratis | Gratis |

## 🎯 Recomendaciones

### Para Desarrollo/Testing:
- **SQLite** (ya funcionando)

### Para Producción Pequeña/Mediana:
- **MySQL** (más popular, fácil de usar)

### Para Producción Grande/Compleja:
- **PostgreSQL** (más potente, mejor para análisis)

### Para Aplicaciones Modernas:
- **MongoDB** (más flexible, ideal para APIs)

## 🔍 Verificar Instalación

### SQLite (Actual):
```bash
node server.cjs
# Visita: http://localhost:3000/contacto
```

### MySQL:
```bash
node server-mysql.cjs
# Visita: http://localhost:3000/contacto
```

### PostgreSQL:
```bash
node server-postgresql.cjs
# Visita: http://localhost:3000/contacto
```

### MongoDB:
```bash
node server-mongodb.cjs
# Visita: http://localhost:3000/contacto
```

## 🆘 Solución de Problemas

### Error de Conexión:
1. Verifica que la base de datos esté instalada
2. Verifica que el servicio esté ejecutándose
3. Verifica las credenciales en el archivo `.env`

### Error de Permisos:
1. Asegúrate de que el usuario tenga permisos para crear tablas
2. Verifica que la base de datos exista

### Error de Puerto:
1. Cambia el puerto en el archivo `.env`
2. Verifica que no haya otro servicio usando el puerto

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa los logs del servidor
2. Verifica la configuración de la base de datos
3. Asegúrate de que todas las dependencias estén instaladas

