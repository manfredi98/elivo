import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LazySection from './components/LazySection';

function App() {
  return (
    <div className="App">
      {/* Header fijo */}
      <Header />
      
      {/* Contenido principal */}
      <main>
        {/* Sección Hero */}
        <Hero />

        {/* Secciones bajo el pliegue: se cargan bajo demanda */}
        <LazySection importer={() => import('./components/Servicios')} id="servicios" placeholderHeight="80vh" />
        <LazySection importer={() => import('./components/Proyectos')} id="proyectos" placeholderHeight="120vh" />
        <LazySection importer={() => import('./components/Nosotros')} id="nosotros" placeholderHeight="100vh" />
        <LazySection importer={() => import('./components/Contacto')} id="contacto" placeholderHeight="120vh" />
      </main>
      
      {/* Footer (también diferido) */}
      <LazySection importer={() => import('./components/Footer')} placeholderHeight="300px" />
    </div>
  );
}

export default App;

