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

  return (
    <div>
      <h2>{product.nombre}</h2>
      <p>{product.categoria}</p>
      <p>{product.descripcion}</p>
      <p>${product.precio}</p>
    </div>
  );
}

export default ProductDetail;
