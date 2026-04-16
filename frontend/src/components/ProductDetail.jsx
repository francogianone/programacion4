import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/productos/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo encontrar el producto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la información del producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="spinner" />
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-message" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AlertCircle size={24} />
          <span>{error || 'Producto no encontrado'}</span>
        </div>
        <button className="back-button" onClick={() => navigate(-1)} style={{ margin: 0 }}>
          <ArrowLeft size={20} /> Volver
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="breadcrumb">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <span>/</span>
        <span>Materia: {product.categoria}</span>
      </div>

      <div className="detail-card">
        <div className="detail-image-section">
          <div className="detail-image-placeholder">
            [ Imagen de Portada ]
          </div>
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <h1 className="detail-title">{product.nombre}</h1>
            <div className="detail-category">{product.categoria}</div>
          </div>

          <div className="detail-price-box">
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Monto: </span>
            <div className="detail-price">${product.precio?.toFixed(2)}</div>
          </div>
          
          <button className="btn-comprar">
            <ShoppingBag size={20} /> 
            Añadir a la cesta
          </button>

          <div className="detail-description-section">
            <h2 className="detail-section-title">Sinopsis</h2>
            <p className="detail-description">
              {product.descripcion || 'Este producto no cuenta con descripción detallada por el momento.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
