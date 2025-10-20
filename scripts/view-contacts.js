import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

async function viewContacts() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elivo_contacts',
  });

  try {
    console.log('🔍 Conectando a PostgreSQL...');
    console.log(`📊 Base de datos: ${process.env.DB_NAME || 'elivo_contacts'}`);
    console.log('');

    // Verificar si la tabla existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contactos'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ La tabla "contactos" no existe');
      console.log('💡 Ejecuta: npm run setup:db');
      return;
    }

    // Obtener todos los contactos
    const result = await pool.query(`
      SELECT 
        id,
        nombreCompleto,
        email,
        telefono,
        mensaje,
        fechaRegistro
      FROM contactos 
      ORDER BY fechaRegistro DESC
    `);

    console.log(`📋 Total de contactos: ${result.rows.length}`);
    console.log('');

    if (result.rows.length === 0) {
      console.log('📭 No hay contactos registrados');
      return;
    }

    // Mostrar contactos
    result.rows.forEach((contacto, index) => {
      console.log(`--- Contacto #${contacto.id} ---`);
      console.log(`👤 Nombre: ${contacto.nombrecompleto}`);
      console.log(`📧 Email: ${contacto.email}`);
      console.log(`📞 Teléfono: ${contacto.telefono || 'No especificado'}`);
      console.log(`💬 Mensaje: ${contacto.mensaje.substring(0, 100)}${contacto.mensaje.length > 100 ? '...' : ''}`);
      console.log(`📅 Fecha: ${new Date(contacto.fecharegistro).toLocaleString('es-CL')}`);
      console.log('');
    });

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Error: No se puede conectar a PostgreSQL');
      console.log('💡 Asegúrate de que PostgreSQL esté ejecutándose');
    } else if (error.code === '28P01') {
      console.error('❌ Error: Credenciales incorrectas');
      console.log('💡 Verifica tu usuario y contraseña en el archivo .env');
    } else if (error.code === '3D000') {
      console.error('❌ Error: La base de datos no existe');
      console.log('💡 Ejecuta: npm run setup:db');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await pool.end();
  }
}

viewContacts();

