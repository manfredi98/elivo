import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import Loading from './Loading';
import Toast from './Toast';
import { useCart } from '../hooks/useCart';

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { agregarAlCarrito } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);


  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/productos`);
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.data);
      } else {
        setError('Error al cargar los productos');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error de conexión al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto);
    setMessage({
      type: 'success',
      text: `${producto.nombre} agregado al carrito`
    });
  };

  const obtenerCategorias = () => {
    const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];
    return categorias;
  };

  const productosFiltrados = categoriaFiltro === 'todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFiltro);

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  if (isLoading) {
    return (
      <section id="tienda" className="bg-gray-50">
        <div className="container-custom section-padding">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="Cargando productos..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tienda" className="bg-gray-50">
        <div className="container-custom section-padding">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={cargarProductos}
              className="bg-elivo-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tienda" className="bg-gray-50">
      <div className="container-custom section-padding">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-elivo-blue font-montserrat mb-6">
            Nuestra Tienda
          </h2>
          <p className="text-xl text-gray-600 font-open-sans max-w-3xl mx-auto">
            Descubre nuestros servicios de desarrollo web y tecnología. 
            Soluciones profesionales para hacer crecer tu negocio.
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {obtenerCategorias().map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                categoriaFiltro === categoria
                  ? 'bg-elivo-blue text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {categoria === 'todas' ? 'Todos' : categoria}
            </button>
          ))}
        </motion.div>

        {/* Grid de productos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {productosFiltrados.map((producto, index) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  producto={producto}
                  onAddToCart={handleAgregarAlCarrito}
                  isLoading={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Mensaje cuando no hay productos */}
        {productosFiltrados.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-500 text-xl">
              No hay productos disponibles en esta categoría
            </div>
          </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
              ¿Necesitas algo personalizado?
            </h3>
            <p className="text-gray-600 mb-6 font-open-sans">
              Si no encuentras exactamente lo que buscas, podemos crear una solución 
              personalizada para tu proyecto. Contáctanos para una consulta gratuita.
            </p>
            <a
              href="#contacto"
              className="inline-block bg-elivo-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contactar Ahora
            </a>
          </div>
        </motion.div>
      </div>

      <Toast message={message} onClose={clearMessage} />
    </section>
  );
};

export default Tienda;
