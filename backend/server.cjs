const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

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

// Configuración de PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elivo_contacts',
});

// Función para crear las tablas si no existen
async function createTables() {
  try {
    // Tabla de contactos
    const contactosQuery = `
      CREATE TABLE IF NOT EXISTS contactos (
        id SERIAL PRIMARY KEY,
        nombreCompleto VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        mensaje TEXT NOT NULL,
        fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Tabla de productos
    const productosQuery = `
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        imagen VARCHAR(500),
        categoria VARCHAR(100),
        stock INTEGER DEFAULT 0,
        activo BOOLEAN DEFAULT true,
        fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Tabla de órdenes
    const ordenesQuery = `
      CREATE TABLE IF NOT EXISTS ordenes (
        id SERIAL PRIMARY KEY,
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_email VARCHAR(255) NOT NULL,
        cliente_telefono VARCHAR(50),
        cliente_direccion TEXT,
        total DECIMAL(10,2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        stripe_payment_intent_id VARCHAR(255),
        fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Tabla de items de orden
    const ordenItemsQuery = `
      CREATE TABLE IF NOT EXISTS orden_items (
        id SERIAL PRIMARY KEY,
        orden_id INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
        producto_id INTEGER REFERENCES productos(id),
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL
      );
    `;
    
    await pool.query(contactosQuery);
    await pool.query(productosQuery);
    await pool.query(ordenesQuery);
    await pool.query(ordenItemsQuery);
    
    console.log('✅ Todas las tablas creadas o verificadas correctamente');
  } catch (error) {
    console.error('❌ Error al crear las tablas:', error);
  }
}

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

    // Insertar en la base de datos
    const query = `
      INSERT INTO contactos (nombreCompleto, email, telefono, mensaje)
      VALUES ($1, $2, $3, $4)
      RETURNING id, fechaRegistro
    `;
    
    const values = [nombreCompleto, email, telefono || null, mensaje];
    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: {
        id: result.rows[0].id,
        fechaRegistro: result.rows[0].fecharegistro
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

// Endpoints para productos
app.get('/api/productos', async (req, res) => {
  try {
    const query = 'SELECT * FROM productos WHERE activo = true ORDER BY fechaCreacion DESC';
    const result = await pool.query(query);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id = $1 AND activo = true';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para crear orden
app.post('/api/ordenes', async (req, res) => {
  try {
    const { cliente, items, total } = req.body;
    
    // Validación básica
    if (!cliente.nombre || !cliente.email || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos de cliente e items son obligatorios'
      });
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }
    
    // Verificar que los productos existan y tengan stock
    for (const item of items) {
      const productoQuery = 'SELECT * FROM productos WHERE id = $1 AND activo = true';
      const productoResult = await pool.query(productoQuery, [item.producto_id]);
      
      if (productoResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Producto con ID ${item.producto_id} no encontrado`
        });
      }
      
      const producto = productoResult.rows[0];
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto ${producto.nombre}`
        });
      }
    }
    
    // Crear la orden
    const ordenQuery = `
      INSERT INTO ordenes (cliente_nombre, cliente_email, cliente_telefono, cliente_direccion, total)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const ordenValues = [
      cliente.nombre,
      cliente.email,
      cliente.telefono || null,
      cliente.direccion || null,
      total
    ];
    
    const ordenResult = await pool.query(ordenQuery, ordenValues);
    const ordenId = ordenResult.rows[0].id;
    
    // Crear los items de la orden
    for (const item of items) {
      const productoQuery = 'SELECT precio FROM productos WHERE id = $1';
      const productoResult = await pool.query(productoQuery, [item.producto_id]);
      const precioUnitario = productoResult.rows[0].precio;
      const subtotal = precioUnitario * item.cantidad;
      
      const itemQuery = `
        INSERT INTO orden_items (orden_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `;
      
      await pool.query(itemQuery, [
        ordenId,
        item.producto_id,
        item.cantidad,
        precioUnitario,
        subtotal
      ]);
      
      // Actualizar stock
      const updateStockQuery = 'UPDATE productos SET stock = stock - $1 WHERE id = $2';
      await pool.query(updateStockQuery, [item.cantidad, item.producto_id]);
    }
    
    // Crear payment intent de Stripe
    let paymentIntent = null;
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // Stripe usa centavos
          currency: 'usd',
          metadata: {
            ordenId: ordenId.toString(),
            clienteEmail: cliente.email
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });
        
        // Actualizar la orden con el payment intent ID
        await pool.query(
          'UPDATE ordenes SET stripe_payment_intent_id = $1 WHERE id = $2',
          [paymentIntent.id, ordenId]
        );
      } catch (stripeError) {
        console.error('Error al crear payment intent:', stripeError);
        // Continuar sin Stripe si hay error
      }
    }

    res.json({
      success: true,
      message: 'Orden creada correctamente',
      data: {
        ordenId,
        total,
        clientSecret: paymentIntent?.client_secret || null
      }
    });
    
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para obtener orden por ID
app.get('/api/ordenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ordenQuery = 'SELECT * FROM ordenes WHERE id = $1';
    const ordenResult = await pool.query(ordenQuery, [id]);
    
    if (ordenResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }
    
    const itemsQuery = `
      SELECT oi.*, p.nombre as producto_nombre, p.imagen as producto_imagen
      FROM orden_items oi
      JOIN productos p ON oi.producto_id = p.id
      WHERE oi.orden_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [id]);
    
    res.json({
      success: true,
      data: {
        orden: ordenResult.rows[0],
        items: itemsResult.rows
      }
    });
    
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoints de Stripe
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Error al crear payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos de Stripe
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // Actualizar estado de la orden en la base de datos
      if (paymentIntent.metadata.ordenId) {
        try {
          await pool.query(
            'UPDATE ordenes SET estado = $1, stripe_payment_intent_id = $2 WHERE id = $3',
            ['completada', paymentIntent.id, paymentIntent.metadata.ordenId]
          );
          console.log('Orden actualizada:', paymentIntent.metadata.ordenId);
        } catch (error) {
          console.error('Error al actualizar orden:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      // Actualizar estado de la orden como fallida
      if (failedPayment.metadata.ordenId) {
        try {
          await pool.query(
            'UPDATE ordenes SET estado = $1, stripe_payment_intent_id = $2 WHERE id = $3',
            ['fallida', failedPayment.id, failedPayment.metadata.ordenId]
          );
          console.log('Orden marcada como fallida:', failedPayment.metadata.ordenId);
        } catch (error) {
          console.error('Error al actualizar orden fallida:', error);
        }
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para SPA en producción
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Inicializar servidor
async function startServer() {
  try {
    // Crear tablas al iniciar
    await createTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Modo: ${isProduction ? 'Producción' : 'Desarrollo'}`);
      console.log(`📊 Base de datos: PostgreSQL`);
      console.log(`🔗 Endpoints disponibles:`);
      console.log(`   - Contacto: POST http://localhost:${PORT}/api/contacto`);
      console.log(`   - Productos: GET http://localhost:${PORT}/api/productos`);
      console.log(`   - Ordenes: POST http://localhost:${PORT}/api/ordenes`);
      console.log(`   - Test: GET http://localhost:${PORT}/api/test`);
      if (isProduction) {
        console.log(`🌐 Aplicación web: http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();