import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

function CartSummary() {
  const { cartTotal, envioSeleccionado, totalConEnvio } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const costoEnvio = envioSeleccionado?.costoEnvio || 0;

  const handleFinalizarCompra = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-summary">
      <h3 className="cart-summary__title">Resumen de pago</h3>
      <div className="cart-summary__row">
        <span>Subtotal</span>
        <span>${cartTotal.toLocaleString('es-AR')}</span>
      </div>
      <div className="cart-summary__row">
        <span>Envío</span>
        <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString('es-AR')}`}</span>
      </div>
      <div className="cart-summary__row cart-summary__total">
        <span>Total</span>
        <span>${totalConEnvio.toLocaleString('es-AR')}</span>
      </div>
      <button
        className="cart-summary__btn"
        onClick={handleFinalizarCompra}
      >
        Finalizar compra
      </button>
      {!user && (
        <p className="cart-summary__auth-hint">
          <Link to="/login?redirect=/checkout">Iniciá sesión</Link> o{' '}
          <Link to="/register?redirect=/checkout">registrate</Link> para continuar.
        </p>
      )}
    </div>
  );
}

export default CartSummary;
