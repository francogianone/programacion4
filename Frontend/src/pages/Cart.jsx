import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import './Cart.css';
import { useState } from 'react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart || cart.productos.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/productos')} className="btn-primary">Ver Productos</button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/ordenes');
      await fetchCart(); // Refresh cart (will be empty)
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Mi Carrito</h2>
      {error && <div className="error-msg">{error}</div>}
      <div className="cart-items">
        {cart.productos.map(item => (
          <div key={item.producto._id} className="cart-item">
            <div className="item-info">
              <h3>{item.producto.nombre}</h3>
              <p>Precio: ${item.producto.precio}</p>
            </div>
            <div className="item-actions">
              <input 
                type="number" 
                min="1" 
                value={item.cantidad} 
                onChange={(e) => updateQuantity(item.producto._id, Number(e.target.value))}
              />
              <button onClick={() => removeFromCart(item.producto._id)} className="btn-danger">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${cartTotal}</h3>
        <div className="summary-actions">
          <button onClick={clearCart} className="btn-outline">Vaciar Carrito</button>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary">
            {loading ? 'Procesando...' : 'Confirmar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
