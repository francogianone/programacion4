import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ESTADOS = ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'];

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [expandida, setExpandida] = useState(null);

  const cargarOrdenes = () => {
    axios.get(`${API_URL}/api/ordenes`)
      .then(res => setOrdenes(res.data))
      .catch(() => alert('Error al cargar ordenes'));
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleEstado = (id, estado) => {
    axios.patch(`${API_URL}/api/ordenes/${id}/estado`, { estado })
      .then(res => {
        setOrdenes(prev =>
          prev.map(o => o._id === id ? { ...o, estado: res.data.estado } : o)
        );
      })
      .catch(() => alert('Error al actualizar estado'));
  };

  const toggleExpandida = (id) => {
    setExpandida(prev => (prev === id ? null : id));
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Ordenes de Compra</h2>
        </div>

        {ordenes.length === 0 ? (
          <p className="empty-state">No hay ordenes registradas</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <>
                  <tr key={orden._id}>
                    <td>{formatFecha(orden.createdAt)}</td>
                    <td>{orden.productos.length} producto(s)</td>
                    <td>${orden.total}</td>
                    <td>
                      <span className={`status-badge status-${orden.estado}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-edit"
                          onClick={() => toggleExpandida(orden._id)}
                        >
                          {expandida === orden._id ? 'Cerrar' : 'Ver detalle'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandida === orden._id && (
                    <tr key={`${orden._id}-detalle`} className="orden-detalle">
                      <td colSpan={5}>
                        <ul className="orden-items-list">
                          {orden.productos.map((item, i) => (
                            <li key={i}>
                              <span>{item.nombre} x{item.cantidad}</span>
                              <span>${item.precio * item.cantidad}</span>
                            </li>
                          ))}
                          <li className="orden-items-list__envio">
                            <span>Envio</span>
                            <span>${orden.costoEnvio}</span>
                          </li>
                          <li className="orden-items-list__total">
                            <span>Total</span>
                            <span>${orden.total}</span>
                          </li>
                        </ul>
                        <div className="estado-actions">
                          <span className="estado-label">
                            Cambiar estado:
                          </span>
                          <select
                            className="orden-estado-select"
                            value={orden.estado}
                            onChange={(e) => handleEstado(orden._id, e.target.value)}
                          >
                            {ESTADOS.map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrdenes;
