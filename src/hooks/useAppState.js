import { useState, useEffect, useCallback } from 'react';

export const useAppState = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Agregar notificación
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
    
    return id;
  }, []);

  // Remover notificación
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mostrar loading
  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Ocultar loading
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isOnline,
    isLoading,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showLoading,
    hideLoading
  };
};

