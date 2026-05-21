import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/carritos');
      setCart(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productoId, cantidad) => {
    try {
      const res = await api.post('/carritos/productos', { productoId, cantidad });
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error' };
    }
  };

  const updateQuantity = async (productoId, cantidad) => {
    try {
      const res = await api.put(`/carritos/productos/${productoId}`, { cantidad });
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error' };
    }
  };

  const removeFromCart = async (productoId) => {
    try {
      const res = await api.delete(`/carritos/productos/${productoId}`);
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error' };
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/carritos');
      setCart(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error' };
    }
  };

  const cartItemsCount = cart ? cart.productos.reduce((acc, item) => acc + item.cantidad, 0) : 0;
  const cartTotal = cart ? cart.productos.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0) : 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartItemsCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
