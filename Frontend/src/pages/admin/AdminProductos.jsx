import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ProductForm from '../../components/Admin/ProductForm';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL;

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [productosInactivos, setProductosInactivos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarProductos = () => {
    axios.get(`${API_URL}/api/productos`)
      .then(res => setProductos(res.data))
      .catch(() => alert('Error al cargar productos'));
  };

  const cargarInactivos = () => {
    axios.get(`${API_URL}/api/productos/inactivos`)
      .then(res => setProductosInactivos(res.data))
      .catch(() => alert('Error al cargar productos inactivos'));
  };

  useEffect(() => {
    cargarProductos();
    cargarInactivos();
  }, []);

  const handleBaja = (id) => {
    if (!confirm('Dar de baja este producto?')) return;
    axios.delete(`${API_URL}/api/productos/${id}`)
      .then(() => {
        alert('Producto dado de baja');
        cargarProductos();
        cargarInactivos();
      })
      .catch(() => alert('Error al dar de baja el producto'));
  };

  const handleRestaurar = (id) => {
    axios.patch(`${API_URL}/api/productos/${id}/restaurar`)
      .then(() => {
        alert('Producto restaurado');
        cargarProductos();
        cargarInactivos();
      })
      .catch(() => alert('Error al restaurar el producto'));
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
  };

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
          <table className="admin-table">
            <thead>
              <tr>
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
        )}
      </div>
    </div>
  );
}

export default AdminProductos;
