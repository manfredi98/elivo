import { useState, useEffect } from 'react';

export const useCart = () => {
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('elivo-carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        setCarrito([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('elivo-carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const productoExistente = prev.find(item => item.id === producto.id);
      
      if (productoExistente) {
        // Verificar stock
        if (productoExistente.cantidad >= producto.stock) {
          return prev; // No agregar si no hay stock
        }
        
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
  };

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

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const abrirCarrito = () => {
    setIsCartOpen(true);
  };

  const cerrarCarrito = () => {
    setIsCartOpen(false);
  };

  const toggleCarrito = () => {
    setIsCartOpen(prev => !prev);
  };

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const impuestos = subtotal * 0.19; // 19% IVA
  const total = subtotal + impuestos;
  const cantidadItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    carrito,
    setCarrito,
    isCartOpen,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    abrirCarrito,
    cerrarCarrito,
    toggleCarrito,
    subtotal,
    impuestos,
    total,
    cantidadItems
  };
};
