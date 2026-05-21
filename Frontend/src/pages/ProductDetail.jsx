import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar producto');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await addToCart(product._id, cantidad);
    if (res.success) {
      setCartMsg('Producto agregado al carrito exitosamente');
      setTimeout(() => setCartMsg(''), 3000);
    } else {
      setCartMsg('Error al agregar al carrito');
    }
  };

  if (loading) return <div className="loading">Cargando detalle...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-image-placeholder">
          🖼️ Imagen de {product.nombre}
        </div>
        <div className="product-info">
          <h2>{product.nombre}</h2>
          <span className="product-category">{product.categoria}</span>
          <p className="product-description">{product.descripcion}</p>
          <div className="product-price-stock">
            <span className="price">${product.precio}</span>
            <span className="stock">Stock disponible: {product.stock}</span>
          </div>
          
          <div className="add-to-cart-section">
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              value={cantidad} 
              onChange={(e) => setCantidad(Number(e.target.value))} 
              className="qty-input"
            />
            <button onClick={handleAddToCart} className="btn-add-cart" disabled={product.stock === 0}>
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
          {cartMsg && <div className="cart-msg">{cartMsg}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
