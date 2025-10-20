const { Pool } = require('pg');
require('dotenv').config();

// Configuración para conectarse a PostgreSQL sin especificar base de datos
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres' // Conectarse a la base de datos por defecto
});

async function setupDatabase() {
  let client;
  
  try {
    console.log('🔗 Conectando a PostgreSQL...');
    client = await adminPool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la base de datos existe
    const dbName = process.env.DB_NAME || 'elivo_contacts';
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    
    const dbExists = await client.query(checkDbQuery, [dbName]);
    
    if (dbExists.rows.length === 0) {
      console.log(`📊 Creando base de datos: ${dbName}`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos ${dbName} creada exitosamente`);
    } else {
      console.log(`✅ Base de datos ${dbName} ya existe`);
    }
    
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await adminPool.end();
  }
}

async function insertSampleData() {
  console.log('\n📦 Insertando datos de ejemplo...');
  
  // Pool para conectarse a la base de datos específica
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elivo_contacts'
  });
  
  let client;
  
  try {
    client = await pool.connect();
    
    // Verificar si ya hay productos
    const existingProducts = await client.query('SELECT COUNT(*) FROM productos');
    const productCount = parseInt(existingProducts.rows[0].count);
    
    if (productCount > 0) {
      console.log(`✅ Ya existen ${productCount} productos en la base de datos`);
      return;
    }
    
    // Insertar productos de ejemplo
    const productos = [
      {
        nombre: 'Diseño de Logo Profesional',
        descripcion: 'Creación de identidad visual completa para tu marca. Incluye 3 propuestas iniciales y 2 revisiones.',
        precio: 150.00,
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        categoria: 'Diseño Gráfico',
        stock: 10
      },
      {
        nombre: 'Desarrollo de Sitio Web',
        descripcion: 'Sitio web responsivo y moderno. Incluye diseño, desarrollo y configuración inicial.',
        precio: 500.00,
        imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        categoria: 'Desarrollo Web',
        stock: 5
      },
      {
        nombre: 'Marketing Digital Básico',
        descripcion: 'Estrategia de marketing digital para redes sociales. Incluye 30 días de gestión.',
        precio: 300.00,
        imagen: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
        categoria: 'Marketing',
        stock: 8
      },
      {
        nombre: 'Fotografía de Productos',
        descripcion: 'Sesión fotográfica profesional para catálogo de productos. Incluye 20 fotos editadas.',
        precio: 200.00,
        imagen: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
        categoria: 'Fotografía',
        stock: 6
      },
      {
        nombre: 'Consultoría Estratégica',
        descripcion: 'Sesión de consultoría de 2 horas para definir estrategias de crecimiento empresarial.',
        precio: 250.00,
        imagen: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
        categoria: 'Consultoría',
        stock: 12
      },
      {
        nombre: 'Rediseño de Marca',
        descripcion: 'Rediseño completo de identidad corporativa. Incluye manual de marca y aplicaciones.',
        precio: 800.00,
        imagen: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',
        categoria: 'Diseño Gráfico',
        stock: 3
      }
    ];
    
    for (const producto of productos) {
      const query = `
        INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await client.query(query, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.imagen,
        producto.categoria,
        producto.stock
      ]);
    }
    
    console.log(`✅ ${productos.length} productos insertados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

async function main() {
  console.log('🚀 Configurando base de datos PostgreSQL...\n');
  
  try {
    await setupDatabase();
    await insertSampleData();
    
    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   - Base de datos: ${process.env.DB_NAME || 'elivo_contacts'}`);
    console.log(`   - Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   - Puerto: ${process.env.DB_PORT || 5432}`);
    console.log(`   - Usuario: ${process.env.DB_USER || 'postgres'}`);
    console.log('\n🔧 Próximos pasos:');
    console.log('   1. Verifica tu archivo .env con las credenciales correctas');
    console.log('   2. Ejecuta: npm run start:postgresql');
    console.log('   3. Visita: http://localhost:3000/api/test');
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    process.exit(1);
  }
}

main();