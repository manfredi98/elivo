const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos en producción
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Array en memoria para simular base de datos
let contactos = [];
let nextId = 1;

// Endpoint para guardar contacto
app.post('/api/contacto', async (req, res) => {
  try {
    const { nombreCompleto, email, telefono, mensaje } = req.body;

    // Validación básica
    if (!nombreCompleto || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, email y mensaje son obligatorios'
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Crear contacto
    const contacto = {
      id: nextId++,
      nombreCompleto,
      email,
      telefono: telefono || null,
      mensaje,
      fechaRegistro: new Date().toISOString()
    };

    // Guardar en memoria
    contactos.push(contacto);

    console.log('📝 Nuevo contacto guardado:', contacto);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: {
        id: contacto.id,
        fechaRegistro: contacto.fechaRegistro
      }
    });

  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para ver todos los contactos
app.get('/api/contactos', (req, res) => {
  res.json({
    success: true,
    data: contactos,
    total: contactos.length
  });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    contactos: contactos.length,
    modo: 'Memoria (sin PostgreSQL)',
    timestamp: new Date().toISOString()
  });
});

// Ruta para SPA en producción
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Modo: ${isProduction ? 'Producción' : 'Desarrollo'}`);
  console.log(`📊 Base de datos: Memoria (sin PostgreSQL)`);
  console.log(`🔗 Endpoint de contacto: POST http://localhost:${PORT}/api/contacto`);
  console.log(`📋 Ver contactos: GET http://localhost:${PORT}/api/contactos`);
  if (isProduction) {
    console.log(`🌐 Aplicación web: http://localhost:${PORT}`);
  }
});
