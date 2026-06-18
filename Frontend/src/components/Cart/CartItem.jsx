import { useCart } from '../../context/CartContext.jsx';
import './Cart.css';

function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const isAgotado = item.agotado || item.stock === 0;

  return (
    <div className={`cart-item ${isAgotado ? 'cart-item--agotado' : ''}`}>
      <div className="cart-item__image-container">
        {item.imagen ? (
          <img src={item.imagen} alt={item.nombre} className="cart-item__image" />
        ) : (
          <div className="cart-item__image-placeholder"></div>
        )}
        {isAgotado && <div className="cart-item__agotado-badge">AGOTADO</div>}
      </div>

      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.nombre}</h3>
        <p className="cart-item__category">{item.categoria}</p>
        <p className="cart-item__price">Precio unitario: ${item.precio}</p>
        <p className="cart-item__subtotal">
          {isAgotado ? 'Sin stock disponible' : `Subtotal: $${item.precio * item.quantity}`}
        </p>
      </div>
      
      <div className="cart-item__controls">
        {!isAgotado && (
          <>
            <button className="qty-btn" onClick={() => decreaseQuantity(item.id)} disabled={isAgotado}>-</button>
            <span className="qty-value">{item.quantity}</span>
            <button className="qty-btn" onClick={() => increaseQuantity(item.id)} disabled={isAgotado || item.quantity >= item.stock}>+</button>
          </>
        )}
        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default CartItem;
