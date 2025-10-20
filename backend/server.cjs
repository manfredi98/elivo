const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mercadopago = require('mercadopago');
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

// Configuración de Mercado Pago (solo si existe token)
if (process.env.MP_ACCESS_TOKEN) {
  try {
    mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });
    console.log('💳 Mercado Pago configurado');
  } catch (err) {
    console.warn('⚠️ No se pudo configurar Mercado Pago:', err.message);
  }
} else {
  console.log('ℹ️ MP_ACCESS_TOKEN no definido. Mercado Pago deshabilitado');
}

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

    // Agregar columnas de pagos si no existen
    const addColumns = [
      `ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)`,
      `ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(255)`,
      `ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS mp_payment_id VARCHAR(255)`,
      `ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS mp_status VARCHAR(50)`
    ];
    for (const sql of addColumns) {
      try {
        await pool.query(sql);
      } catch (e) {
        console.warn('⚠️ No se pudo agregar columna (puede que ya exista):', e.message);
      }
    }
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
    const { cliente, items, total, payment_method } = req.body;
    
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
    
    // Configurar método de pago escogido (opcional)
    if (payment_method) {
      await pool.query('UPDATE ordenes SET payment_method = $1 WHERE id = $2', [payment_method, ordenId]);
    }

    // Crear payment intent de Stripe si corresponde
    let paymentIntent = null;
    if (!payment_method || payment_method === 'stripe') {
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

// Crear preferencia de Mercado Pago para una orden
app.post('/api/ordenes/:id/mercadopago/preference', async (req, res) => {
  const { id } = req.params;
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(400).json({ success: false, message: 'Mercado Pago no está configurado' });
    }

    // Obtener orden
    const ordenResult = await pool.query('SELECT * FROM ordenes WHERE id = $1', [id]);
    if (ordenResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }

    // Obtener items de la orden con datos del producto
    const itemsQuery = `
      SELECT oi.cantidad, oi.precio_unitario, p.nombre
      FROM orden_items oi
      JOIN productos p ON p.id = oi.producto_id
      WHERE oi.orden_id = $1
    `;
    const itemsResult = await pool.query(itemsQuery, [id]);
    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'La orden no tiene items' });
    }

    const preference = {
      items: itemsResult.rows.map((row) => ({
        title: row.nombre,
        quantity: Number(row.cantidad),
        unit_price: Number(row.precio_unitario),
        currency_id: 'CLP',
      })),
      back_urls: {
        success: `${req.protocol}://${req.get('host')}/api/mercadopago/return?status=approved&ordenId=${id}`,
        failure: `${req.protocol}://${req.get('host')}/api/mercadopago/return?status=rejected&ordenId=${id}`,
        pending: `${req.protocol}://${req.get('host')}/api/mercadopago/return?status=pending&ordenId=${id}`,
      },
      auto_return: 'approved',
      external_reference: String(id),
      notification_url: `${req.protocol}://${req.get('host')}/api/mercadopago/webhook`,
      metadata: { ordenId: String(id) },
    };

    const prefResult = await mercadopago.preferences.create(preference);
    const initPoint = prefResult?.body?.init_point || prefResult?.body?.sandbox_init_point;
    const prefId = prefResult?.body?.id || null;

    if (prefId) {
      await pool.query('UPDATE ordenes SET payment_method = $1, mp_preference_id = $2, estado = $3 WHERE id = $4', [
        'mercadopago',
        prefId,
        'pendiente',
        id,
      ]);
    }

    return res.json({ success: true, data: { initPoint, preferenceId: prefId } });
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return res.status(500).json({ success: false, message: 'Error al crear preferencia de pago' });
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

// Webhook de Mercado Pago
app.post('/api/mercadopago/webhook', async (req, res) => {
  try {
    const paymentIdFromQuery = req.query?.id || req.query?.data_id;
    const type = req.query?.type || req.query?.topic; // payment, merchant_order

    let paymentId = null;
    if (type === 'payment' && paymentIdFromQuery) {
      paymentId = paymentIdFromQuery;
    } else if (req.body && req.body.data && req.body.data.id) {
      paymentId = req.body.data.id;
    }

    if (!paymentId) {
      console.log('Webhook MP recibido sin paymentId identificable');
      return res.status(200).json({ received: true });
    }

    // Obtener pago desde Mercado Pago
    const paymentResponse = await mercadopago.payment.findById(paymentId);
    const payment = paymentResponse?.body;
    if (!payment) {
      return res.status(200).json({ received: true });
    }

    const ordenId = payment.external_reference || payment.metadata?.ordenId;
    const mpStatus = payment.status; // approved, pending, rejected

    if (ordenId) {
      let estado = 'pendiente';
      if (mpStatus === 'approved') estado = 'completada';
      else if (mpStatus === 'rejected') estado = 'fallida';

      try {
        await pool.query(
          'UPDATE ordenes SET estado = $1, payment_method = $2, mp_payment_id = $3, mp_status = $4 WHERE id = $5',
          [estado, 'mercadopago', String(paymentId), mpStatus, ordenId]
        );
        console.log(`Orden ${ordenId} actualizada por webhook MP -> ${estado}`);
      } catch (e) {
        console.error('Error al actualizar orden via webhook MP:', e);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    return res.status(200).json({ received: true });
  }
});

// URL de retorno desde Mercado Pago
app.get('/api/mercadopago/return', async (req, res) => {
  try {
    const { status, payment_id, ordenId, external_reference } = req.query;
    const orderId = ordenId || external_reference;
    if (orderId) {
      let estado = 'pendiente';
      if (status === 'approved') estado = 'completada';
      else if (status === 'rejected') estado = 'fallida';
      
      try {
        await pool.query(
          'UPDATE ordenes SET estado = $1, payment_method = $2, mp_payment_id = COALESCE($3, mp_payment_id), mp_status = $4 WHERE id = $5',
          [estado, 'mercadopago', payment_id ? String(payment_id) : null, status, orderId]
        );
      } catch (e) {
        console.error('Error al actualizar orden en retorno MP:', e.message);
      }
    }
    // Redirigir a la app (home) con parámetros simples
    const redirectUrl = `/${isProduction ? '' : ''}?pago=${encodeURIComponent(status || 'unknown')}&orden=${encodeURIComponent(orderId || '')}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error en retorno de Mercado Pago:', error.message);
    return res.redirect('/');
  }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// =========== CRUD de Productos (edición sencilla) ===========
// Crear producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoria, stock = 0, activo = true } = req.body;
    if (!nombre || precio == null) {
      return res.status(400).json({ success: false, message: 'nombre y precio son obligatorios' });
    }
    const insertQuery = `
      INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [nombre, descripcion || null, precio, imagen || null, categoria || null, stock, activo]);
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Actualizar producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, categoria, stock, activo } = req.body;
    // Construir actualización dinámica
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, value] of Object.entries({ nombre, descripcion, precio, imagen, categoria, stock, activo })) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay cambios para aplicar' });
    }
    values.push(id);
    const updateQuery = `UPDATE productos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Eliminar (lógico) producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE productos SET activo = false WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    return res.json({ success: true, message: 'Producto desactivado', data: result.rows[0] });
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
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