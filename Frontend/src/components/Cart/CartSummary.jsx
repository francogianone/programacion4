import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

// TODO: reemplazar con cotizacion de API de correo
const COSTO_ENVIO = 2000;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CartSummary() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const total = cartTotal + COSTO_ENVIO;

  const handleFinalizarCompra = async () => {
    if (!user) {
      navigate('/login?redirect=/carrito');
      return;
    }
    setProcesando(true);
    try {
      await axios.post(`${API_URL}/api/ordenes`, {
        productos: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity
        })),
        costoEnvio: COSTO_ENVIO
      });
      alert('Orden creada correctamente');
      clearCart();
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error inesperado';
      alert(`Error: ${mensaje}`);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="cart-summary">
      <h3 className="cart-summary__title">Resumen de pago</h3>
      <div className="cart-summary__row">
        <span>Subtotal</span>
        <span>${cartTotal}</span>
      </div>
      <div className="cart-summary__row">
        <span>Envio</span>
        <span>${COSTO_ENVIO}</span>
      </div>
      <div className="cart-summary__row cart-summary__total">
        <span>Total</span>
        <span>${total}</span>
      </div>
      <button
        className="cart-summary__btn"
        onClick={handleFinalizarCompra}
        disabled={procesando}
      >
        {procesando ? 'Procesando...' : 'Finalizar compra'}
      </button>
      {!user && (
        <p className="cart-summary__auth-hint">
          <Link to="/login?redirect=/carrito">Iniciá sesión</Link> o{' '}
          <Link to="/register?redirect=/carrito">registrate</Link> para continuar.
        </p>
      )}
    </div>
  );
}

export default CartSummary;
