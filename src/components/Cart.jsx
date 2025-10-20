import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Input from './Input';
import Loading from './Loading';
import Toast from './Toast';
import Checkout from './Checkout';

const Cart = ({ isOpen, onClose, carrito, setCarrito }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [errors, setErrors] = useState({});
  const [ordenCreada, setOrdenCreada] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const impuestos = subtotal * 0.19; // 19% IVA
  const total = subtotal + impuestos;

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito(prev => prev.map(item =>
      item.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
    setMessage({
      type: 'success',
      text: 'Producto eliminado del carrito'
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!cliente.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!cliente.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cliente.email)) {
        nuevosErrores.email = 'El formato del email no es válido';
      }
    }

    if (cliente.telefono && cliente.telefono.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(cliente.telefono)) {
        nuevosErrores.telefono = 'El formato del teléfono no es válido';
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const crearOrden = async () => {
    if (!validarFormulario()) {
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const ordenData = {
        cliente,
        items: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        })),
        total: total,
        payment_method: 'mercadopago'
      };

      const response = await fetch(`${API_BASE_URL}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenData),
      });

      const data = await response.json();

      if (data.success) {
        setOrdenCreada({
          id: data.data.ordenId,
          cliente_nombre: cliente.nombre,
          cliente_email: cliente.email,
          total: total,
          clientSecret: data.data.clientSecret
        });

        // Crear preferencia de Mercado Pago y redirigir
        try {
          const prefResp = await fetch(`${API_BASE_URL}/api/ordenes/${data.data.ordenId}/mercadopago/preference`, {
            method: 'POST'
          });
          const prefData = await prefResp.json();
          if (prefData.success && prefData.data?.initPoint) {
            window.location.href = prefData.data.initPoint;
            return;
          }
        } catch (e) {
          console.error('Error creando preferencia de Mercado Pago:', e);
        }

        // Si no hay MP o falla, fallback al checkout interno
        setShowCheckout(true);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Error al crear la orden'
        });
      }
    } catch (error) {
      console.error('Error al crear orden:', error);
      setMessage({
        type: 'error',
        text: 'Error de conexión. Por favor, inténtalo más tarde.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutSuccess = () => {
    // Limpiar carrito y formulario
    setCarrito([]);
    setCliente({ nombre: '', email: '', telefono: '', direccion: '' });
    setOrdenCreada(null);
    setShowCheckout(false);
    onClose();
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setOrdenCreada(null);
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panel del carrito */}
        <motion.div
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat">
                Carrito de Compras
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {carrito.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                  <p className="text-gray-400 text-sm mt-2">Agrega algunos productos para comenzar</p>
                </div>
              ) : (
                <>
                  {/* Items del carrito */}
                  <div className="space-y-4 mb-6">
                    {carrito.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                          {item.imagen ? (
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.nombre}</h3>
                          <p className="text-gray-500 text-xs">${item.precio.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Formulario de cliente */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Información de Contacto</h3>
                    
                    <Input
                      label="Nombre Completo"
                      name="nombre"
                      value={cliente.nombre}
                      onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                      error={errors.nombre}
                      required
                    />
                    
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={cliente.email}
                      onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                      error={errors.email}
                      required
                    />
                    
                    <Input
                      label="Teléfono (opcional)"
                      name="telefono"
                      value={cliente.telefono}
                      onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                      error={errors.telefono}
                    />
                    
                    <Input
                      label="Dirección (opcional)"
                      name="direccion"
                      value={cliente.direccion}
                      onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer con totales y botón de compra */}
            {carrito.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (19%):</span>
                    <span>${impuestos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-elivo-blue">${total.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button
                  onClick={crearOrden}
                  disabled={isProcessing}
                  className="w-full"
                  variant="primary"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loading size="sm" text="Procesando..." />
                    </div>
                  ) : (
                    'Continuar al Pago'
                  )}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <Toast message={message} onClose={clearMessage} />
      
      {/* Componente de checkout */}
      {showCheckout && ordenCreada && (
        <Checkout
          orden={ordenCreada}
          clientSecret={ordenCreada.clientSecret}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      )}
    </AnimatePresence>
  );
};

export default Cart;
