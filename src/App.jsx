import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Servicios from './components/Servicios';
import Proyectos from './components/Proyectos';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      {/* Header fijo */}
      <Header />
      
      {/* Contenido principal */}
      <main>
        {/* Sección Hero */}
        <Hero />
        
        {/* Sección Servicios */}
        <Servicios />
        
        {/* Sección Proyectos */}
        <Proyectos />
        
        {/* Sección Nosotros */}
        <Nosotros />
        
        {/* Sección Contacto */}
        <Contacto />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
Y