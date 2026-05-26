import { createContext, useContext, useState, useEffect } from 'react';

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

  // 4. Función addToCart (agrega o incrementa cantidad)
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
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
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
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

  // 7. Cantidad total de productos en el carrito (cartQuantity)
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 8. Total del carrito en dinero (cartTotal)
  const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
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
