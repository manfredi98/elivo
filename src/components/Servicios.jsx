import React from 'react';
import { motion } from 'framer-motion';

const Servicios = () => {
  const servicios = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Instalaciones Eléctricas',
      description: 'Instalaciones residenciales, comerciales e industriales con los más altos estándares de calidad y seguridad.',
      features: ['Residencial', 'Comercial', 'Industrial', 'Certificaciones']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Mantención',
      description: 'Servicios de mantención preventiva y correctiva para mantener sus instalaciones en óptimas condiciones.',
      features: ['Preventiva', 'Correctiva', 'Emergencias 24/7', 'Mantenimiento programado']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Consultoría Técnica',
      description: 'Asesoría especializada en proyectos eléctricos, estudios de carga y optimización energética.',
      features: ['Estudios técnicos', 'Optimización energética', 'Asesoría normativa', 'Proyectos especiales']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Servicios Especializados',
      description: 'Soluciones técnicas avanzadas para necesidades específicas del sector eléctrico.',
      features: ['Automatización', 'Sistemas de emergencia', 'Energías renovables', 'Domótica']
    }
  ];

  return (
    <section id="servicios" className="bg-gray-50">
      <div className="container-custom section-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-elivo-blue font-montserrat mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 font-open-sans max-w-3xl mx-auto">
            Ofrecemos soluciones eléctricas integrales con más de 10 años de experiencia 
            en La Serena y Región de Coquimbo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicios.map((servicio, index) => (
            <motion.div
              key={servicio.title}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-elivo-yellow mb-6">
                {servicio.icon}
              </div>
              
              <h3 className="text-xl font-bold text-elivo-blue font-montserrat mb-4">
                {servicio.title}
              </h3>
              
              <p className="text-gray-600 font-open-sans mb-6 leading-relaxed">
                {servicio.description}
              </p>
              
              <ul className="space-y-2">
                {servicio.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    className="flex items-center text-sm text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.1) }}
                    viewport={{ once: true }}
                  >
                    <svg className="w-4 h-4 text-elivo-yellow mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#contacto"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Solicitar Cotización
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Servicios;
