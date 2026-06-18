import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear el proveedor (CartProvider)
export const CartProvider = ({ children }) => {
  // 3. Persistencia en localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 4. Función addToCart (agrega o incrementa cantidad, respeta stock)
  const addToCart = (product, qty = 1) => {
    const productId = product.id || product._id;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + qty, product.stock);
        if (existingItem.quantity === newQty) return prevItems;
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { ...product, id: productId, quantity: Math.min(qty, product.stock) }];
    });
  };

  // 5. Función removeFromCart (elimina completamente el producto)
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Funciones auxiliares para sumar/restar unidades desde la página del carrito
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // 6. Función clearCart (vaciar carrito)
  const clearCart = () => {
    setCartItems([]);
  };

  // Sincronizar stock del carrito con el backend
  const syncCartStock = useCallback(async () => {
    if (cartItems.length === 0) return;
    try {
      const res = await axios.get(`${API_URL}/api/productos`);
      const productosDb = res.data;
      
      setCartItems((prevItems) => {
        let changed = false;
        const newItems = prevItems.map(item => {
          const prodDb = productosDb.find(p => p._id === item.id);
          // Si el producto fue borrado o inactivo, o el stock cambió
          const currentStock = prodDb ? prodDb.stock : 0;
          const isAgotado = currentStock === 0;
          
          if (item.stock !== currentStock || item.agotado !== isAgotado) {
            changed = true;
            let newQuantity = item.quantity;
            // Si el stock nuevo es menor a la cantidad, bajamos la cantidad (si > 0)
            if (currentStock < newQuantity && currentStock > 0) {
              newQuantity = currentStock;
            }
            return { ...item, stock: currentStock, agotado: isAgotado, quantity: newQuantity };
          }
          return item;
        });
        return changed ? newItems : prevItems;
      });
    } catch (error) {
      console.error('Error sincronizando stock del carrito', error);
    }
  }, [cartItems.length]);

  // 7. Cantidad total de productos válidos en el carrito
  const validCartItems = cartItems.filter(item => !item.agotado);
  const cartQuantity = validCartItems.reduce((total, item) => total + item.quantity, 0);

  // 8. Total del carrito en dinero
  const cartTotal = validCartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      syncCartStock,
      cartQuantity,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 9. Crear el hook useCart para simplificar el uso del contexto
export const useCart = () => {
  return useContext(CartContext);
};
