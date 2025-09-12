import React from 'react';
import { motion } from 'framer-motion';

const Nosotros = () => {
  const valores = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Seguridad',
      description: 'Priorizamos la seguridad en cada proyecto, cumpliendo con todas las normativas y estándares de la industria eléctrica.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Eficiencia',
      description: 'Optimizamos cada instalación para maximizar el rendimiento energético y reducir costos operativos.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Cumplimiento Normativo',
      description: 'Garantizamos el cumplimiento de todas las regulaciones y normativas vigentes en el sector eléctrico.'
    }
  ];

  return (
    <section id="nosotros" className="bg-gray-50">
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-elivo-blue font-montserrat mb-6">
              Sobre Nosotros
            </h2>
            
            <p className="text-lg text-gray-700 font-open-sans mb-8 leading-relaxed">
              <strong>Elivo</strong> es una empresa especializada en soluciones eléctricas integrales 
              con más de 10 años de experiencia en La Serena y Región de Coquimbo. 
              Nuestro equipo de profesionales altamente capacitados se dedica a brindar 
              servicios de la más alta calidad, cumpliendo con los más estrictos estándares 
              de seguridad y eficiencia.
            </p>
            
            <p className="text-lg text-gray-700 font-open-sans mb-8 leading-relaxed">
              Nos especializamos en instalaciones eléctricas residenciales, comerciales e industriales, 
              mantención preventiva y correctiva, consultoría técnica y servicios especializados. 
              Nuestro compromiso es entregar soluciones que superen las expectativas de nuestros clientes.
            </p>

            <div className="grid sm:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-elivo-yellow font-montserrat">10+</div>
                <div className="text-sm text-gray-600 font-open-sans">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-elivo-yellow font-montserrat">500+</div>
                <div className="text-sm text-gray-600 font-open-sans">Proyectos completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-elivo-yellow font-montserrat">100%</div>
                <div className="text-sm text-gray-600 font-open-sans">Clientes satisfechos</div>
              </div>
            </div>

            <motion.a
              href="#contacto"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Conoce Nuestro Equipo
            </motion.a>
          </motion.div>

          {/* Valores */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-elivo-blue font-montserrat mb-8">
              Nuestros Valores
            </h3>
            
            {valores.map((valor, index) => (
              <motion.div
                key={valor.title}
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-elivo-yellow flex-shrink-0 mt-1">
                    {valor.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-elivo-blue font-montserrat mb-2">
                      {valor.title}
                    </h4>
                    <p className="text-gray-600 font-open-sans leading-relaxed">
                      {valor.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;
