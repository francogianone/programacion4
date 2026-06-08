import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext.jsx';
import './ProductDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agregado, setAgregado] = useState(false);

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

  if (loading) return <p>Cargando</p>;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  const sinStock = product.stock !== undefined && product.stock <= 0;

  const handleAgregar = () => {
    addToCart(product);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <div className="product-detail">
      <h2>{product.nombre}</h2>
      {product.imagen && (
        <div className="product-detail__image-container">
          <img src={product.imagen} alt={product.nombre} className="product-detail__image" />
        </div>
      )}
      <p className="product-detail__category">Categoría: {product.categoria}</p>
      <p className="product-detail__description">{product.descripcion || 'Sin descripción disponible.'}</p>
      <p className="product-detail__price">Precio: ${product.precio}</p>
      <p className={`product-detail__stock ${sinStock ? 'product-detail__stock--out' : 'product-detail__stock--ok'}`}>
        {sinStock ? '🔴 Sin stock disponible' : `🟢 Stock disponible: ${product.stock}`}
      </p>
      <button
        className="product-detail__btn"
        onClick={handleAgregar}
        disabled={sinStock}
      >
        {agregado ? 'Agregado al carrito' : 'Agregar al carrito'}
      </button>
    </div>
  );
}

export default ProductDetail;
