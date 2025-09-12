# Elivo - Soluciones Eléctricas Integrales

Landing page moderna para empresa de servicios eléctricos en La Serena y Región de Coquimbo, desarrollada con React, Vite, Tailwind CSS y Framer Motion.

## 🚀 Características

- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Animaciones Suaves**: Implementadas con Framer Motion para una experiencia de usuario excepcional
- **Componentes Modulares**: Estructura limpia y mantenible con componentes React separados
- **Colores Corporativos**: Paleta de colores personalizada (azul oscuro #0A2540, amarillo eléctrico #FFD60A)
- **Tipografías Profesionales**: Montserrat para títulos y Open Sans para texto
- **SEO Optimizado**: Estructura semántica y meta tags optimizados

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida y moderna
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Biblioteca de animaciones para React
- **PostCSS** - Procesador de CSS
- **ESLint** - Linter para JavaScript/React

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes git instalado
   git clone <url-del-repositorio>
   cd elivo-project
   
   # O simplemente navegar al directorio del proyecto
   cd elivo-project
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 📁 Estructura del Proyecto

```
elivo-project/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── Header.jsx     # Navegación principal
│   │   ├── Hero.jsx       # Sección principal
│   │   ├── Servicios.jsx  # Sección de servicios
│   │   ├── Proyectos.jsx  # Galería de proyectos
│   │   ├── Nosotros.jsx   # Información de la empresa
│   │   ├── Contacto.jsx   # Formulario de contacto
│   │   └── Footer.jsx     # Pie de página
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind
├── postcss.config.js      # Configuración de PostCSS
├── vite.config.js         # Configuración de Vite
└── README.md              # Este archivo
```

## 🎨 Personalización

### Colores

Los colores corporativos están definidos en `tailwind.config.js`:

```javascript
colors: {
  'elivo-blue': '#0A2540',
  'elivo-yellow': '#FFD60A',
}
```

### Tipografías

Las fuentes están configuradas en `index.html` y `tailwind.config.js`:

- **Montserrat**: Para títulos y encabezados
- **Open Sans**: Para texto del cuerpo

### Componentes

Cada sección es un componente independiente que puede ser modificado fácilmente:

- **Header**: Navegación con menú responsive
- **Hero**: Sección principal con call-to-action
- **Servicios**: Tarjetas de servicios con animaciones
- **Proyectos**: Galería de proyectos destacados
- **Nosotros**: Información de la empresa y valores
- **Contacto**: Formulario y información de contacto
- **Footer**: Enlaces y datos de contacto

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático desde GitHub

1. **Subir el proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Iniciar sesión con GitHub
   - Importar el repositorio
   - Vercel detectará automáticamente que es un proyecto Vite
   - Hacer clic en "Deploy"

### Opción 2: Despliegue Manual

1. **Construir el proyecto**
   ```bash
   npm run build
   ```

2. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Desplegar**
   ```bash
   vercel
   ```

4. **Seguir las instrucciones en pantalla**

### Configuración de Vercel

El proyecto incluye configuración automática para Vercel:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 📱 Responsive Design

El sitio está optimizado para:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## ⚡ Optimizaciones

- **Lazy Loading**: Imágenes cargadas bajo demanda
- **Code Splitting**: Carga optimizada de componentes
- **CSS Purging**: Eliminación de estilos no utilizados
- **Minificación**: Código optimizado para producción

## 🔧 Configuración Adicional

### Variables de Entorno

Crear un archivo `.env` para configuraciones específicas:

```env
VITE_APP_TITLE=Elivo - Soluciones Eléctricas
VITE_APP_DESCRIPTION=Servicios eléctricos en La Serena y Región de Coquimbo
```

### Google Maps

Para personalizar el mapa embebido, editar el `src` del iframe en `Contacto.jsx`:

```jsx
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.123456789!2d-71.2345678!3d-29.9012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU0JzA0LjQiUyA3McKwMTQnMDQuNCJX!5e0!3m2!1ses!2scl!4v1234567890123!5m2!1ses!2scl"
```

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:

- **Email**: contacto@elivo.cl
- **Teléfono**: +56 51 234 5678
- **Dirección**: Av. Francisco de Aguirre 1234, La Serena

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Elivo** - Soluciones Eléctricas Integrales en La Serena y Región de Coquimbo
