import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        // Fallback for demo when backend fails
        console.error(err);
        setError('Error de conexión con el servidor. Revisa si el backend (.env PORT=3000) está corriendo y CORS habilitado.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Cargando catálogo premium...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="catalog-header">
        <h1 className="catalog-title">Explora nuestra colección</h1>
        <p className="catalog-subtitle">Descubre productos increíbles con diseños de vanguardia.</p>
      </div>

      {products.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No hay productos disponibles por el momento.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ padding: '0', border: '1px solid var(--border)' }}
            >
              <div className="product-image-placeholder">
                [ Portada ]
              </div>
              <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span className="category-badge">{product.categoria}</span>
                <h3 className="product-name">{product.nombre}</h3>
                <div className="product-price">${product.precio?.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
