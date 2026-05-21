import { Link } from 'react-router-dom';

function ProductCard({ id, nombre, precio, categoria }) {
  return (
    <Link to={`/productos/${id}`} className="product-card">
      <div className="card-image-placeholder">
        📦
      </div>
      <div className="card-content">
        <h3 className="card-title">{nombre}</h3>
        <p className="card-category">{categoria}</p>
        <p className="card-price">${precio}</p>
      </div>
    </Link>
  );
}

export default ProductCard;