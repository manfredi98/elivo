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
  const [busqueda, setBusqueda] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { agregarAlCarrito } = useCart();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  if (isLoading) {
    return (
      <section id="tienda" className="bg-gradient-to-b from-gray-50 to-white">
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
      <section id="tienda" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom section-padding">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 3h6a2 2 0 012 2v18a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
              <button
                onClick={cargarProductos}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="tienda" className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container-custom">
        {/* Header con Gradiente */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-elivo-yellow text-elivo-blue px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              Catálogo Completo
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 font-montserrat mb-4">
            Nuestra <span className="bg-gradient-to-r from-elivo-blue to-blue-600 bg-clip-text text-transparent">Tienda</span>
          </h2>
          <p className="text-xl text-gray-600 font-open-sans max-w-3xl mx-auto">
            Soluciones profesionales de Ingeniería Eléctrica integral para tu proyecto. Accesorios, equipos y materiales eléctricos.
          </p>
        </motion.div>

        {/* Buscador */}
        <motion.div
          className="mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-elivo-blue transition-colors"
            />
          </div>
        </motion.div>

        {/* Filtros - Mejorados */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {obtenerCategorias().map((categoria, idx) => (
            <motion.button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                categoriaFiltro === categoria
                  ? 'bg-elivo-blue text-white shadow-lg shadow-elivo-blue/30'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-elivo-blue'
              }`}
            >
              {categoria === 'todas' ? 'Todos' : categoria}
            </motion.button>
          ))}
        </motion.div>

        {/* Contador de productos */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600 font-medium">
            Mostrando <span className="text-elivo-blue font-bold">{productosFiltrados.length}</span> producto{productosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Grid de productos */}
        {productosFiltrados.length > 0 ? (
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
                  whileHover={{ y: -10 }}
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
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No hay productos que coincidan con tu búsqueda
              </p>
              <button
                onClick={() => {
                  setBusqueda('');
                  setCategoriaFiltro('todas');
                }}
                className="mt-4 text-elivo-blue font-semibold hover:underline"
              >
                Ver todos los productos
              </button>
            </div>
          </motion.div>
        )}

        {/* CTA personalizado */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-elivo-blue to-blue-600 rounded-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold font-montserrat mb-4">
              ¿Necesitas algo personalizado?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Si no encuentras exactamente lo que buscas, podemos crear una solución personalizada para tu proyecto específico.
            </p>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-elivo-blue px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-lg"
            >
              Solicitar Consulta Gratuita
            </motion.a>
          </div>
        </motion.div>
      </div>

      <Toast message={message} onClose={clearMessage} />
    </section>
  );
};

export default Tienda;