import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/Cards/ProductCard';
import './Products.css';

const API_URL = import.meta.env.VITE_API_URL;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/productos`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
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