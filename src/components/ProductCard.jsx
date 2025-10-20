import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const ProductCard = ({ producto, onAddToCart, isLoading }) => {
  const handleAddToCart = () => {
    if (producto.stock > 0) {
      onAddToCart(producto);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Imagen del producto */}
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="absolute inset-0 flex items-center justify-center text-gray-400"
          style={{ display: producto.imagen ? 'none' : 'flex' }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-elivo-blue text-white px-2 py-1 rounded-full text-xs font-medium">
            {producto.categoria}
          </span>
        </div>
        
        {/* Badge de stock */}
        <div className="absolute top-3 right-3">
          {producto.stock > 0 ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              En Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 font-open-sans line-clamp-3">
          {producto.descripcion}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-elivo-blue font-montserrat">
            ${producto.precio.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Stock: {producto.stock}
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={producto.stock === 0 || isLoading}
          className="w-full"
          variant={producto.stock === 0 ? 'secondary' : 'primary'}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Agregando...
            </div>
          ) : producto.stock === 0 ? (
            'Agotado'
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Agregar al Carrito
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
