import { useState, useCallback } from 'react';

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [retryCount, setRetryCount] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const sendContact = useCallback(async (formData, retries = 3) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || '¡Mensaje enviado correctamente!'
        });
        setRetryCount(0);
        return { success: true, data: data.data };
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Error al enviar el mensaje'
        });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error al enviar contacto:', error);
      
      if (retries > 0) {
        setRetryCount(prev => prev + 1);
        setMessage({
          type: 'warning',
          text: `Error de conexión. Reintentando... (${retries} intentos restantes)`
        });
        
        // Reintentar después de 2 segundos
        setTimeout(() => {
          sendContact(formData, retries - 1);
        }, 2000);
        
        return { success: false, error: error.message, retrying: true };
      } else {
        setMessage({
          type: 'error',
          text: 'Error de conexión. Por favor, inténtalo más tarde.'
        });
        setRetryCount(0);
        return { success: false, error: error.message };
      }
    } finally {
      if (retries === 0) {
        setIsLoading(false);
      }
    }
  }, [API_BASE_URL]);

  const clearMessage = useCallback(() => {
    setMessage({ type: '', text: '' });
    setRetryCount(0);
  }, []);

  const validateForm = useCallback((formData) => {
    const errors = {};

    if (!formData.nombreCompleto?.trim()) {
      errors.nombreCompleto = 'El nombre completo es obligatorio';
    } else if (formData.nombreCompleto.trim().length < 2) {
      errors.nombreCompleto = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email?.trim()) {
      errors.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'El formato del email no es válido';
      }
    }

    if (!formData.mensaje?.trim()) {
      errors.mensaje = 'El mensaje es obligatorio';
    } else if (formData.mensaje.trim().length < 10) {
      errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (formData.telefono && formData.telefono.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(formData.telefono)) {
        errors.telefono = 'El formato del teléfono no es válido';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  return {
    isLoading,
    message,
    retryCount,
    sendContact,
    clearMessage,
    validateForm
  };
};
