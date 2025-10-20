const http = require('http');

async function checkServerStatus() {
  console.log('🔍 Verificando estado del servidor...\n');
  
  const endpoints = [
    { name: 'Test', url: 'http://localhost:3000/api/test' },
    { name: 'Productos', url: 'http://localhost:3000/api/productos' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: OK`);
        if (endpoint.name === 'Productos' && data.data) {
          console.log(`   📦 Productos disponibles: ${data.data.length}`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Servidor no disponible`);
    }
  }
  
  console.log('\n📋 URLs disponibles:');
  console.log('   🌐 Frontend: http://localhost:5173');
  console.log('   🔧 API Test: http://localhost:3000/api/test');
  console.log('   📦 Productos: http://localhost:3000/api/productos');
  console.log('   📧 Contacto: POST http://localhost:3000/api/contacto');
}

checkServerStatus().catch(console.error);
