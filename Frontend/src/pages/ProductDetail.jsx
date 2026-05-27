import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '40px auto', background: '#fff', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>{product.nombre}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '14px' }}>Categoría: {product.categoria}</p>
      <p style={{ marginBottom: '20px', lineHeight: '1.6', color: 'var(--text-main)' }}>{product.descripcion || 'Sin descripción disponible.'}</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '12px' }}>Precio: ${product.precio}</p>
      <p style={{ 
        fontSize: '14px', 
        color: sinStock ? '#c0392b' : 'var(--btn-green)', 
        fontWeight: 'bold'
      }}>
        {sinStock ? '🔴 Sin stock disponible' : `🟢 Stock disponible: ${product.stock}`}
      </p>
    </div>
  );
}

export default ProductDetail;
