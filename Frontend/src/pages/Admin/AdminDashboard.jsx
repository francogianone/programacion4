import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import './Admin.css';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [activeTab, setActiveTab] = useState('productos');

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, userRes, orderRes] = await Promise.all([
        api.get('/productos'),
        api.get('/usuarios'),
        api.get('/ordenes/admin/todas')
      ]);
      setProductos(prodRes.data);
      setUsuarios(userRes.data);
      setOrdenes(orderRes.data);
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    await api.delete(`/productos/${id}`);
    setProductos(productos.filter(p => p._id !== id));
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      
      <div className="admin-tabs">
        <button className={activeTab === 'productos' ? 'active' : ''} onClick={() => setActiveTab('productos')}>Productos</button>
        <button className={activeTab === 'usuarios' ? 'active' : ''} onClick={() => setActiveTab('usuarios')}>Usuarios</button>
        <button className={activeTab === 'ordenes' ? 'active' : ''} onClick={() => setActiveTab('ordenes')}>Órdenes</button>
      </div>

      <div className="admin-content">
        {activeTab === 'productos' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p._id}>
                    <td>{p.nombre}</td>
                    <td>${p.precio}</td>
                    <td>{p.stock}</td>
                    <td>{p.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <button className="btn-danger-sm" onClick={() => handleDeleteProduct(p._id)}>Dar de baja</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u._id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ordenes' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map(o => (
                  <tr key={o._id}>
                    <td>{o._id.substring(0,8)}</td>
                    <td>{o.usuario?.email}</td>
                    <td>${o.total}</td>
                    <td>{o.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
