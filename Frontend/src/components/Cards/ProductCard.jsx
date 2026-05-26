import './Card.css'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

function ProductCard({ id, nombre, precio, categoria, descripcion }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <h3>{nombre}</h3>
      <p>{categoria}</p>
      <p>{descripcion}</p>
      <p>${precio}</p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
        <Link to={`/productos/${id}`}>Ver detalle</Link>
        <button onClick={() => addToCart({ id, nombre, precio, categoria, descripcion })}>
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard