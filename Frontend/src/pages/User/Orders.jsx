import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import './Orders.css';

const Orders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await api.get('/ordenes');
        setOrdenes(res.data);
      } catch (error) {
        console.error('Error al obtener órdenes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  if (loading) return <div className="loading">Cargando órdenes...</div>;

  return (
    <div className="orders-container">
      <h2>Mis Órdenes de Compra</h2>
      {ordenes.length === 0 ? (
        <p>No tienes órdenes previas.</p>
      ) : (
        <div className="orders-list">
          {ordenes.map(orden => (
            <div key={orden._id} className="order-card">
              <div className="order-header">
                <h3>Orden #{orden._id.substring(0, 8)}</h3>
                <span className={`status ${orden.estado}`}>{orden.estado}</span>
              </div>
              <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</p>
              <div className="order-items">
                {orden.productos.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.producto?.nombre} (x{item.cantidad})</span>
                    <span>${item.precio * item.cantidad}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total:</strong> ${orden.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
