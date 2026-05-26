import { useCart } from '../../context/CartContext.jsx';
import './Cart.css';

function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.nombre}</h3>
        <p className="cart-item__category">{item.categoria}</p>
        <p className="cart-item__price">Precio unitario: ${item.precio}</p>
        <p className="cart-item__subtotal">Subtotal: ${item.precio * item.quantity}</p>
      </div>
      <div className="cart-item__controls">
        <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
        <span className="qty-value">{item.quantity}</span>
        <button className="qty-btn" onClick={() => increaseQuantity(item.id)}>+</button>
        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default CartItem;
