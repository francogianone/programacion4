import './Card.css'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

function ProductCard({ id, nombre, precio, categoria, descripcion, stock }) {
  const { addToCart } = useCart();
  const sinStock = stock !== undefined && stock <= 0;

  return (
    <div className="card">
      <h3>{nombre}</h3>
      <p>{categoria}</p>
      <p>{descripcion}</p>
      <p style={{ fontWeight: '500' }}>${precio}</p>
      <p style={{
        fontSize: '12.5px',
        color: sinStock ? '#c0392b' : 'var(--text-muted)',
        fontWeight: sinStock ? 'bold' : 'normal',
        marginTop: '4px'
      }}>
        {sinStock ? '🔴 Sin stock' : `🟢 Stock: ${stock !== undefined ? stock : 0}`}
      </p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
        <Link to={`/productos/${id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px', borderRadius: '4px', textDecoration: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          Ver detalle
        </Link>
        <button
          onClick={() => addToCart({ id, nombre, precio, categoria, descripcion, stock })}
          disabled={sinStock}
          style={{
            backgroundColor: sinStock ? '#e0e0e0' : 'var(--primary)',
            color: sinStock ? '#999' : '#fff',
            border: 'none',
            padding: '7px 12px',
            borderRadius: '4px',
            fontSize: '12.5px',
            cursor: sinStock ? 'not-allowed' : 'pointer'
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard