import './Card.css'
import { Link } from 'react-router-dom'

function ProductCard({ id, nombre, precio, categoria, descripcion }) {
  return (
    <div className="card">
      <h3>{nombre}</h3>
      <p>{categoria}</p>
      <p>{descripcion}</p>
      <p>${precio}</p>
      <Link to={`/productos/${id}`}>Ver detalle</Link>
    </div>
  )
}

export default ProductCard