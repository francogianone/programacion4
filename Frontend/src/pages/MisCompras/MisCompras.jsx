import { useState, useEffect } from 'react';
import axios from 'axios';
import './MisCompras.css';

const API_URL = import.meta.env.VITE_API_URL;

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  enviada: 'Enviada',
  entregada: 'Entregada',
  cancelada: 'Cancelada'
};

const ESTADO_CLASES = {
  pendiente: 'estado-pendiente',
  confirmada: 'estado-confirmada',
  enviada: 'estado-enviada',
  entregada: 'estado-entregada',
  cancelada: 'estado-cancelada'
};

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/ordenes/mis-compras`);
        setCompras(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar tus compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const formatFecha = (isoString) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

  return (
    <main className="mis-compras-container">
        <h1 className="mis-compras-titulo">Mis Compras</h1>

        {loading && (
          <p className="mis-compras-estado">Cargando tus compras...</p>
        )}

        {error && (
          <p className="mis-compras-estado mis-compras-error">{error}</p>
        )}

        {!loading && !error && compras.length === 0 && (
          <p className="mis-compras-estado">Todavía no realizaste ninguna compra.</p>
        )}

        {!loading && !error && compras.length > 0 && (
          <div className="compras-lista">
            {compras.map((compra) => (
              <div key={compra._id} className="compra-card">
                <div className="compra-card__header">
                  <div>
                    <span className="compra-card__fecha">
                      {formatFecha(compra.createdAt)}
                    </span>
                    <span className="compra-card__id">#{compra._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <span className={`compra-estado ${ESTADO_CLASES[compra.estado]}`}>
                    {ESTADO_LABELS[compra.estado] || compra.estado}
                  </span>
                </div>

                <div className="compra-card__productos">
                  {compra.productos.map((item, i) => (
                    <div key={i} className="compra-item">
                      <span className="compra-item__nombre">{item.nombre}</span>
                      <span className="compra-item__detalle">
                        {formatPrecio(item.precio)} x {item.cantidad}
                      </span>
                      <span className="compra-item__subtotal">
                        {formatPrecio(item.precio * item.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="compra-card__footer">
                  <span className="compra-envio">Envio: {formatPrecio(compra.costoEnvio)}</span>
                  <span className="compra-total">Total: {formatPrecio(compra.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
    </main>
  );
}

export default MisCompras;
