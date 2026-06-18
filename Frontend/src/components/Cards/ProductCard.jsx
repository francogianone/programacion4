import './Card.css';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { ShoppingCart, Eye, Tag } from 'lucide-react';

function ProductCard({ id, nombre, precio, categoria, descripcion, stock, imagen }) {
  const { addToCart, cartItems } = useCart();
  const cartItem = cartItems.find(item => item.id === id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const stockDisponible = (stock !== undefined ? stock : 0) - qtyInCart;
  const sinStock = stockDisponible <= 0;

  return (
    <article className="card">
      <Link to={`/productos/${id}`} className="card__image-link" tabIndex={-1} aria-hidden="true">
        <div className="card__image-wrap">
          {imagen ? (
            <img
              src={imagen}
              alt={nombre}
              className="card__image"
            />
          ) : (
            <div className="card__image-placeholder">
              <span>Sin imagen</span>
            </div>
          )}
        </div>
      </Link>

      <div className="card__body">
        {categoria && (
          <span className="card__category">
            <Tag size={11} strokeWidth={2} />
            {categoria}
          </span>
        )}

        <h3 className="card__title">{nombre}</h3>

        {descripcion && (
          <p className="card__description">{descripcion}</p>
        )}

        <div className="card__footer">
          <div className="card__price-row">
            <p className="card__price">${precio}</p>
            <span className={`card__stock ${sinStock ? 'card__stock--out' : 'card__stock--ok'}`}>
              {sinStock ? 'Sin stock' : `Stock: ${stockDisponible}`}
            </span>
          </div>

          <div className="card__actions">
            <Link to={`/productos/${id}`} className="card__btn-detail" aria-label={`Ver detalle de ${nombre}`}>
              <Eye size={15} />
              Ver detalle
            </Link>
            <button
              onClick={() => addToCart({ id, nombre, precio, categoria, descripcion, stock, imagen })}
              disabled={sinStock}
              className={`card__btn-cart ${sinStock ? 'card__btn-cart--disabled' : ''}`}
              aria-label={`Agregar ${nombre} al carrito`}
            >
              <ShoppingCart size={15} />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;