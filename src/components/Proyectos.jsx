import React from 'react';
import { motion } from 'framer-motion';

const Proyectos = ({ id }) => {
  const proyectos = [
    {
      id: 1,
      title: 'Instalación Eléctrica Residencial',
      description: 'Instalación completa en vivienda de 200m² en La Serena, incluyendo tablero principal, iluminación LED y tomas especializadas.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'La Serena, Coquimbo',
      year: '2023',
      features: ['Tablero principal', 'Iluminación LED', 'Tomas especializadas', 'Certificación SEC']
    },
    {
      id: 2,
      title: 'Proyecto Comercial - Supermercado',
      description: 'Instalación eléctrica completa para supermercado de 1,500m² en Coquimbo, incluyendo sistemas de emergencia y automatización.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Coquimbo, Coquimbo',
      year: '2023',
      features: ['Sistema de emergencia', 'Automatización', 'Eficiencia energética', 'Mantenimiento programado']
    },
    {
      id: 3,
      title: 'Instalación Industrial - Planta Minera',
      description: 'Proyecto de gran envergadura para planta minera en la Región de Coquimbo, incluyendo sistemas de alta tensión y automatización industrial.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      location: 'Región de Coquimbo',
      year: '2024',
      features: ['Alta tensión', 'Automatización industrial', 'Sistemas de seguridad', 'Cumplimiento normativo']
    }
  ];

  return (
    <section id={id || 'proyectos'} className="bg-white">
      <div className="container-custom section-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-elivo-blue font-montserrat mb-6">
            Proyectos Destacados
          </h2>
          <p className="text-xl text-gray-600 font-open-sans max-w-3xl mx-auto">
            Conoce algunos de nuestros proyectos más importantes realizados en La Serena y Región de Coquimbo
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {proyectos.map((proyecto, index) => (
            <motion.div
              key={proyecto.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={proyecto.image}
                  alt={proyecto.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="absolute top-4 right-4 bg-elivo-yellow text-elivo-blue px-3 py-1 rounded-full text-sm font-semibold">
                  {proyecto.year}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-elivo-blue font-montserrat mb-3">
                  {proyecto.title}
                </h3>
                
                <p className="text-gray-600 font-open-sans mb-4 leading-relaxed">
                  {proyecto.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {proyecto.location}
                </div>
                
                <div className="space-y-2">
                  {proyecto.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-center text-sm text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                      viewport={{ once: true }}
                    >
                      <svg className="w-4 h-4 text-elivo-yellow mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#contacto"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Más Proyectos
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Proyectos;
