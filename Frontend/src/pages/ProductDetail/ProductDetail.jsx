import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext.jsx';
import { ShoppingCart, Tag, Package, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { PageLoader, PageError } from '../../components/UI/PageLoader';
import './ProductDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agregado, setAgregado] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    axios.get(`${API_URL}/api/productos/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar producto');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      const cItem = cartItems.find(item => item.id === product._id);
      const qInCart = cItem ? cItem.quantity : 0;
      const sDisponible = product.stock - qInCart;
      if (cantidad > sDisponible && sDisponible > 0) {
        setCantidad(sDisponible);
      }
    }
  }, [product, cartItems, cantidad]);

  if (loading) return <PageLoader text="Cargando producto..." />;
  if (error) return <PageError text={error} />;
  if (!product) return null;

  const cartItem = cartItems.find(item => item.id === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const stockDisponible = (product.stock !== undefined ? product.stock : 0) - qtyInCart;
  const sinStock = stockDisponible <= 0;

  const handleAgregar = () => {
    addToCart(product, cantidad);
    setAgregado(true);
    setCantidad(1); // reset quantity after adding
    setTimeout(() => setAgregado(false), 1800);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <Link to="/productos" className="product-detail__back">
          <ArrowLeft size={15} />
          Volver al catálogo
        </Link>

        <div className="product-detail__layout">
          {/* Image */}
          <div className="product-detail__image-container">
            {product.imagen ? (
              <img src={product.imagen} alt={product.nombre} className="product-detail__image" />
            ) : (
              <div className="product-detail__image-placeholder">Sin imagen</div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            {product.categoria && (
              <span className="product-detail__category">
                <Tag size={12} strokeWidth={2} />
                {product.categoria}
              </span>
            )}

            <h1 className="product-detail__title">{product.nombre}</h1>

            <p className="product-detail__description">
              {product.descripcion || 'Sin descripción disponible.'}
            </p>

            <p className="product-detail__price">${product.precio}</p>

            <div className={`product-detail__stock ${sinStock ? 'product-detail__stock--out' : 'product-detail__stock--ok'}`}>
              {sinStock
                ? <><XCircle size={15} /> Sin stock disponible</>
                : <><CheckCircle size={15} /> Stock disponible: {stockDisponible}</>
              }
            </div>

            {!sinStock && (
              <div className="product-detail__quantity-selector">
                <span className="quantity-label">Cantidad:</span>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setCantidad(c => Math.max(1, c - 1))} 
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{cantidad}</span>
                  <button 
                    onClick={() => setCantidad(c => Math.min(stockDisponible, c + 1))} 
                    disabled={cantidad >= stockDisponible}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className={`product-detail__btn ${agregado ? 'product-detail__btn--added' : ''}`}
              onClick={handleAgregar}
              disabled={sinStock}
            >
              <ShoppingCart size={17} />
              {agregado ? 'Agregado al carrito' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
