import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Input from './Input';
import Loading from './Loading';
import Toast from './Toast';

const Checkout = ({ orden, clientSecret, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const procesarPagoStripe = async () => {
    if (!clientSecret) {
      setMessage({
        type: 'error',
        text: 'No se pudo inicializar el sistema de pagos'
      });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // Aquí normalmente integrarías Stripe Elements
      // Por ahora simularemos el proceso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({
        type: 'success',
        text: '¡Pago procesado correctamente! Te contactaremos pronto.'
      });
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setMessage({
        type: 'error',
        text: 'Error al procesar el pago. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const procesarPagoManual = async () => {
    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // Simular procesamiento manual
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({
        type: 'success',
        text: '¡Orden procesada correctamente! Te contactaremos pronto para coordinar el pago.'
      });
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error al procesar orden:', error);
      setMessage({
        type: 'error',
        text: 'Error al procesar la orden. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'stripe') {
      procesarPagoStripe();
    } else {
      procesarPagoManual();
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
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
        onClick={onCancel}
      />

      {/* Panel de checkout */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-montserrat">
                Finalizar Compra
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Resumen de la orden */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Resumen de tu orden</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Orden #:</span>
                  <span className="font-medium">{orden.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="font-medium">{orden.cliente_nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{orden.cliente_email}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-elivo-blue">${orden.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Método de pago</h3>
                <div className="space-y-3">
                  {clientSecret && (
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Pago con tarjeta</div>
                        <div className="text-sm text-gray-500">Procesado de forma segura con Stripe</div>
                      </div>
                    </label>
                  )}
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="manual"
                      checked={paymentMethod === 'manual'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Pago manual</div>
                      <div className="text-sm text-gray-500">Te contactaremos para coordinar el pago</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Información importante:</p>
                    <p>Una vez procesado el pago, nos pondremos en contacto contigo para coordinar la entrega del servicio.</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loading size="sm" text="Procesando..." />
                    </div>
                  ) : (
                    paymentMethod === 'stripe' ? 'Pagar Ahora' : 'Confirmar Orden'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <Toast message={message} onClose={clearMessage} />
    </motion.div>
  );
};

export default Checkout;
