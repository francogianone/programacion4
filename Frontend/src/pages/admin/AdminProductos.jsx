import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ProductForm from '../../components/Admin/ProductForm';
import { useAuth } from '../../context/AuthContext';
import { confirmDialog, toastSuccess, toastError } from '../../utils/alerts';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminProductos() {

  const { token, loading } = useAuth();
  const [productos, setProductos] = useState([]);
  const [productosInactivos, setProductosInactivos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarProductos = () => {
    if (!token) return;

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get(`${API_URL}/api/productos?_t=${Date.now()}`, config)
      .then(res => {
        const data = res.data;
        setProductos(Array.isArray(data) ? data : data.productos ?? data.data ?? []);
      })
      .catch((err) => {
        console.error("Error productos activos:", err.response || err);
        toastError('Error al cargar productos');
      });
  };

  const cargarInactivos = () => {
    if (!token) return;

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get(`${API_URL}/api/productos/inactivos?_t=${Date.now()}`, config)
      .then(res => {
        const data = res.data;
        setProductosInactivos(Array.isArray(data) ? data : data.productos ?? data.data ?? []);
      })
      .catch((err) => {
        console.error("Error productos inactivos:", err.response || err);
        toastError('Error al cargar productos inactivos');
      });
  };

  useEffect(() => {
    if (!loading && token) {
      cargarProductos();
      cargarInactivos();
    }

  }, [loading, token]);

  const handleBaja = async (id) => {
    const ok = await confirmDialog(
      '¿Dar de baja este producto?',
      'El producto quedará inactivo y no aparecerá en el catálogo.',
      'Dar de baja'
    );
    if (!ok) return;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    axios.delete(`${API_URL}/api/productos/${id}`, config)
      .then(() => {
        toastSuccess('Producto dado de baja');
        cargarProductos();
        cargarInactivos();
      })
      .catch((err) => {
        const msj = err.response?.data?.error || err.message || 'Error desconocido';
        toastError(`Error al dar de baja: ${msj}`);
      });
  };

  const handleRestaurar = (id) => {
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    axios.patch(`${API_URL}/api/productos/${id}/restaurar`, {}, config)
      .then(() => {
        toastSuccess('Producto restaurado');
        cargarProductos();
        cargarInactivos();
      })
      .catch((err) => {
        const msj = err.response?.data?.error || err.message || 'Error desconocido';
        toastError(`Error al restaurar: ${msj}`);
      });
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNuevo = () => {
    setProductoEditando(null);
    setMostrarForm(true);
  };

  const handleFormSuccess = () => {
    setMostrarForm(false);
    setProductoEditando(null);
    cargarProductos();
    cargarInactivos();
  };

  if (loading) {
    return <div className="admin-layout"><p className="loading-center">Cargando panel de administración...</p></div>;
  }


  const lista = mostrarInactivos ? productosInactivos : productos;

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Productos</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`toggle-inactivos${mostrarInactivos ? ' toggle-inactivos--active' : ''}`}
              onClick={() => setMostrarInactivos(!mostrarInactivos)}
            >
              {mostrarInactivos ? 'Ver activos' : `Ver inactivos (${productosInactivos.length})`}
            </button>
            {!mostrarInactivos && (
              <button className="btn-primary" onClick={handleNuevo}>
                Nuevo producto
              </button>
            )}
          </div>
        </div>

        {mostrarForm && (
          <div style={{ marginBottom: '24px' }}>
            <ProductForm
              modo={productoEditando ? 'editar' : 'crear'}
              productoInicial={productoEditando}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {lista.length === 0 ? (
          <p className="empty-state">
            {mostrarInactivos ? 'No hay productos dados de baja' : 'No hay productos cargados'}
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p._id}>
                  <td>{p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <span>—</span>}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock !== undefined ? p.stock : 0}</td>
                  <td>{p.descripcion || '-'}</td>
                  <td>
                    <div className="table-actions">
                      {mostrarInactivos ? (
                        <button className="btn-restore" onClick={() => handleRestaurar(p._id)}>
                          Restaurar
                        </button>
                      ) : (
                        <>
                          <button className="btn-edit" onClick={() => handleEditar(p)}>
                            Editar
                          </button>
                          <button className="btn-danger" onClick={() => handleBaja(p._id)}>
                            Dar de baja
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductos;
