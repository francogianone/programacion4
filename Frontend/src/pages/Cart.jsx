import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Tu carrito está vacío</h3>
        <Link to="/productos">Ir a productos</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Carrito de Compras</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {cartItems.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{item.nombre}</h3>
              <p>Precio Unitario: ${item.precio}</p>
              <p>Subtotal: ${item.precio * item.quantity}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
              <button 
                onClick={() => removeFromCart(item.id)} 
                style={{ marginLeft: '15px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Total General: ${cartTotal}</h3>
        <div>
          <button 
            onClick={clearCart} 
            style={{ backgroundColor: '#888', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
