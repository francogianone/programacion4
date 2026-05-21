import { useState, useEffect } from 'react';
import api from '../utils/axios';
import ProductCard from '../components/Cards/ProductCard';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/productos')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Cargando catálogo...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Nuestro Catálogo</h1>
      <div className="products-container">
        {products.map(product => (
          <ProductCard
            key={product._id}
            id={product._id}
            nombre={product.nombre}
            precio={product.precio}
            categoria={product.categoria}
            descripcion={product.descripcion}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;