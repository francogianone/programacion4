import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import { toastError } from '../../utils/alerts';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'entregada', label: 'Entregada' },
  { value: 'cancelada', label: 'Cancelada' }
];

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [expandida, setExpandida] = useState(null);

  const cargarOrdenes = () => {
    axios.get(`${API_URL}/api/ordenes`)
      .then(res => setOrdenes(res.data))
      .catch(() => toastError('Error al cargar ordenes'));
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleEstado = async (id, estado) => {
    const estadoLabel = ESTADOS.find(e => e.value === estado)?.label || estado;

    // 1. Confirmacion
    const { isConfirmed } = await Swal.fire({
      title: 'Cambiar estado',
      text: `¿Deseas cambiar el estado de la orden a "${estadoLabel}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#e4e0da',
      reverseButtons: true,
      focusCancel: true,
      customClass: { cancelButton: 'swal-cancel-btn' }
    });

    if (!isConfirmed) return;

    // 2. Procesando
    Swal.fire({
      title: 'Actualizando...',
      text: 'Cambiando estado y notificando al cliente.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const res = await axios.patch(`${API_URL}/api/ordenes/${id}/estado`, { estado });
      setOrdenes(prev =>
        prev.map(o => o._id === id ? { ...o, estado: res.data.estado } : o)
      );

      // 3. Exito
      await Swal.fire({
        title: '¡Estado actualizado!',
        html: `El estado fue cambiado a <strong>${estadoLabel}</strong> y se notificó al cliente por email.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1a1a1a'
      });
    } catch {
      Swal.close();
      toastError('Error al actualizar estado');
    }
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
        <div className="admin-table-container">
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
                <Fragment key={orden._id}>
                  <tr>
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
                    <tr className="orden-detalle">
                      <td colSpan={5}>
                        <div className="orden-detalle__inner">

                          {/* ── Cabecera: codigo + usuario ── */}
                          <div className="orden-detalle__meta">
                            <div className="orden-meta-item">
                              <span className="orden-meta-label">Codigo de orden</span>
                              <span className="orden-meta-value orden-meta-value--code">
                                #{orden._id.slice(-8).toUpperCase()}
                              </span>
                            </div>
                            {orden.usuario && (
                              <>
                                <div className="orden-meta-item">
                                  <span className="orden-meta-label">Cliente</span>
                                  <span className="orden-meta-value">{orden.usuario.nombre}</span>
                                </div>
                                <div className="orden-meta-item">
                                  <span className="orden-meta-label">Email</span>
                                  <span className="orden-meta-value">{orden.usuario.email}</span>
                                </div>
                              </>
                            )}
                            <div className="orden-meta-item">
                              <span className="orden-meta-label">Metodo de pago</span>
                              <span className="orden-meta-value">
                                {orden.metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo en local'}
                              </span>
                            </div>
                            <div className="orden-meta-item">
                              <span className="orden-meta-label">Tipo de entrega</span>
                              <span className="orden-meta-value">
                                {orden.tipoEntrega === 'envio' ? 'Envio a domicilio' : 'Retiro en local'}
                              </span>
                            </div>
                          </div>

                          {/* ── Grilla info: facturacion + envio ── */}
                          <div className="orden-detalle__info-grid">
                            <div className="orden-info-block">
                              <h4 className="orden-info-block__title">Datos de facturacion</h4>
                              <p><strong>Nombre:</strong> {orden.datosFacturacion?.nombre}</p>
                              <p><strong>DNI:</strong> {orden.datosFacturacion?.dni}</p>
                              <p><strong>Domicilio:</strong> {orden.datosFacturacion?.domicilio}</p>
                            </div>

                            {orden.tipoEntrega === 'envio' && orden.datosEnvio && (
                              <div className="orden-info-block">
                                <h4 className="orden-info-block__title">Datos de envio</h4>
                                <p><strong>Domicilio:</strong> {orden.datosEnvio.domicilio}</p>
                              </div>
                            )}
                          </div>

                          {/* ── Items ── */}
                          <ul className="orden-items-list">
                            {orden.productos.map((item, i) => (
                              <li key={i}>
                                <span>{item.nombre} x{item.cantidad}</span>
                                <span>${item.precio * item.cantidad}</span>
                              </li>
                            ))}
                            <li className="orden-items-list__envio">
                              <span>Costo de envio</span>
                              <span>${orden.costoEnvio}</span>
                            </li>
                            <li className="orden-items-list__total">
                              <span>Total</span>
                              <span>${orden.total}</span>
                            </li>
                          </ul>

                          {/* ── Cambiar estado ── */}
                          <div className="estado-actions">
                            <span className="estado-label">Cambiar estado:</span>
                            <select
                              className="orden-estado-select"
                              value={orden.estado}
                              onChange={(e) => handleEstado(orden._id, e.target.value)}
                            >
                              {ESTADOS.map(e => (
                                <option key={e.value} value={e.value}>{e.label}</option>
                              ))}
                            </select>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdenes;
