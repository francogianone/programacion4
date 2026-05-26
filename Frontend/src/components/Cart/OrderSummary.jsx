import { useCart } from '../../context/CartContext.jsx';
import './Cart.css';

function OrderSummary() {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Tu pedido</h3>
      <ul className="order-summary__list">
        {cartItems.map((item) => (
          <li key={item.id} className="order-summary__item">
            <span className="order-summary__name">
              {item.nombre} x{item.quantity}
            </span>
            <span className="order-summary__price">${item.precio * item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="order-summary__total-row">
        <span>Subtotal</span>
        <span>${cartTotal}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
