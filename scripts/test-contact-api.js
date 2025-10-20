import fetch from 'node-fetch';

async function testContactAPI() {
  const testData = {
    nombreCompleto: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    telefono: '+56 9 1234 5678',
    mensaje: 'Este es un mensaje de prueba desde el script de testing'
  };

  try {
    console.log('🧪 Probando API de contacto...');
    console.log('📤 Enviando datos:', testData);

    const response = await fetch('http://localhost:3000/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('📊 Status:', response.status);
    console.log('📋 Respuesta:', result);

    if (result.success) {
      console.log('✅ Prueba exitosa! El contacto se guardó correctamente.');
    } else {
      console.log('❌ Error en la prueba:', result.message);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
  }
}

// Ejecutar la prueba
testContactAPI();
