import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ id }) => {
  return (
    <section id={id || 'inicio'} className="pt-20 bg-gradient-to-br from-elivo-blue to-blue-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Elivo – Soluciones Eléctricas Integrales
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-8 font-open-sans"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              En La Serena y Región de Coquimbo
            </motion.p>
            
            <motion.p 
              className="text-lg text-blue-200 mb-10 font-open-sans leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Especialistas en instalaciones eléctricas, mantención y consultoría técnica. 
              Brindamos soluciones seguras, eficientes y cumpliendo todas las normativas vigentes.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a
                href="#contacto"
                aria-label="Ir a contacto"
                className="btn-primary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Presupuesto
              </motion.a>
              
              <motion.a
                href="#servicios"
                aria-label="Ir a servicios"
                className="btn-secondary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Servicios
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Imagen/Ilustración */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                {/* Iconos representativos */}
                <motion.div 
                  className="bg-elivo-yellow/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-elivo-yellow rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-elivo-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm">Instalaciones</h3>
                </motion.div>
                
                <motion.div 
                  className="bg-elivo-yellow/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-elivo-yellow rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-elivo-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm">Mantención</h3>
                </motion.div>
                
                <motion.div 
                  className="bg-elivo-yellow/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-elivo-yellow rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-elivo-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm">Consultoría</h3>
                </motion.div>
                
                <motion.div 
                  className="bg-elivo-yellow/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-elivo-yellow rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-elivo-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm">Especializados</h3>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
