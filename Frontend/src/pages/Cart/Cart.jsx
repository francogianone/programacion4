import { useEffect } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';
import OrderSummary from '../../components/Cart/OrderSummary';
import '../../components/Cart/Cart.css';

function Cart() {
  const { cartItems, clearCart, syncCartStock } = useCart();

  useEffect(() => {
    syncCartStock();
  }, [syncCartStock]);

  const validItems = cartItems.filter(item => !item.agotado);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Tu carrito esta vacio</h3>
        <Link to="/productos">Ir a productos</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h2>Carrito de Compras</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        {validItems.length > 0 && (
          <aside className="cart-sidebar">
            <OrderSummary />
            <CartSummary />
          </aside>
        )}
      </div>
    </div>
  );
}

export default Cart;
