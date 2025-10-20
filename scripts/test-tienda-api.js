const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

async function testTiendaAPI() {
  console.log('🧪 Probando API de la Tienda Elivo');
  console.log('=====================================\n');

  try {
    // 1. Probar endpoint de productos
    console.log('1️⃣ Probando endpoint de productos...');
    const productosResponse = await fetch(`${API_BASE_URL}/api/productos`);
    const productosData = await productosResponse.json();
    
    if (productosData.success) {
      console.log(`✅ Productos obtenidos: ${productosData.data.length}`);
      productosData.data.forEach(producto => {
        console.log(`   - ${producto.nombre}: $${producto.precio} (Stock: ${producto.stock})`);
      });
    } else {
      console.log('❌ Error al obtener productos:', productosData.message);
    }
    console.log('');

    // 2. Probar endpoint de contacto
    console.log('2️⃣ Probando endpoint de contacto...');
    const contactoData = {
      nombreCompleto: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      telefono: '+56912345678',
      mensaje: 'Hola, me interesa conocer más sobre sus servicios.'
    };

    const contactoResponse = await fetch(`${API_BASE_URL}/api/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactoData),
    });

    const contactoResult = await contactoResponse.json();
    
    if (contactoResult.success) {
      console.log('✅ Contacto guardado correctamente');
      console.log(`   ID: ${contactoResult.data.id}`);
      console.log(`   Fecha: ${contactoResult.data.fechaRegistro}`);
    } else {
      console.log('❌ Error al guardar contacto:', contactoResult.message);
    }
    console.log('');

    // 3. Probar endpoint de órdenes
    console.log('3️⃣ Probando endpoint de órdenes...');
    const ordenData = {
      cliente: {
        nombre: 'María González',
        email: 'maria@ejemplo.com',
        telefono: '+56987654321',
        direccion: 'Av. Principal 123, Santiago'
      },
      items: [
        {
          producto_id: 1,
          cantidad: 1
        }
      ],
      total: 299.99
    };

    const ordenResponse = await fetch(`${API_BASE_URL}/api/ordenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ordenData),
    });

    const ordenResult = await ordenResponse.json();
    
    if (ordenResult.success) {
      console.log('✅ Orden creada correctamente');
      console.log(`   ID: ${ordenResult.data.ordenId}`);
      console.log(`   Total: $${ordenResult.data.total}`);
      if (ordenResult.data.clientSecret) {
        console.log('   Payment Intent creado para Stripe');
      }
    } else {
      console.log('❌ Error al crear orden:', ordenResult.message);
    }
    console.log('');

    // 4. Probar endpoint de test
    console.log('4️⃣ Probando endpoint de test...');
    const testResponse = await fetch(`${API_BASE_URL}/api/test`);
    const testData = await testResponse.json();
    
    if (testData.message) {
      console.log('✅ Servidor funcionando:', testData.message);
    } else {
      console.log('❌ Error en endpoint de test');
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose:');
    console.log('   npm run start:postgresql');
  }

  console.log('\n=====================================');
  console.log('🏁 Pruebas completadas');
}

testTiendaAPI();
