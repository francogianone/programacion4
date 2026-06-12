import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const COSTO_ENVIO = 2000;

function CartSummary() {
  const { cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cartTotal + COSTO_ENVIO;

  const handleFinalizarCompra = () => {
    if (!user) {
      navigate('/login?redirect=/carrito');
      return;
    }
    navigate('/checkout');
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
      >
        Finalizar compra
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
