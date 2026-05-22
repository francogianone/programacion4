import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import './Admin.css';

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [activeTab, setActiveTab] = useState('productos');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    nombre: '', precio: '', categoria: '', stock: '', descripcion: ''
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    nombre: '', email: '', contrasena: '', rol: 'cliente'
  });

  const fetchData = async () => {
    const [prodRes, userRes, orderRes] = await Promise.all([
      api.get('/productos/admin/todos'),
        api.get('/usuarios'),
        api.get('/ordenes/admin/todas')
      ]);
      setProductos(prodRes.data);
      setUsuarios(userRes.data);
      setOrdenes(orderRes.data);
    };
    fetchData();
  }, []);

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        nombre: product.nombre,
        precio: product.precio,
        categoria: product.categoria,
        stock: product.stock,
        descripcion: product.descripcion || ''
      });
    } else {
      setEditingProduct(null);
      setProductFormData({ nombre: '', precio: '', categoria: '', stock: '', descripcion: '' });
    }
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await api.put(`/productos/${editingProduct._id}`, productFormData);
    } else {
      await api.post('/productos', productFormData);
    }
    fetchData();
    handleCloseProductModal();
  };

  const handleDeleteProduct = async (id) => {
    await api.delete(`/productos/${id}`);
    fetchData();
  };

  const handleRestoreProduct = async (id) => {
    await api.put(`/productos/${id}/restaurar`);
    fetchData();
  };

  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        nombre: user.nombre,
        email: user.email,
        contrasena: '',
        rol: user.rol
      });
    } else {
      setEditingUser(null);
      setUserFormData({ nombre: '', email: '', contrasena: '', rol: 'cliente' });
    }
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await api.put(`/usuarios/${editingUser._id}`, userFormData);
    } else {
      await api.post('/usuarios/registro', userFormData);
    }
    fetchData();
    handleCloseUserModal();
  };

  const handleDeleteUser = async (id) => {
    await api.delete(`/usuarios/${id}`);
    fetchData();
  };

  const handleRestoreUser = async (id) => {
    await api.put(`/usuarios/${id}/restaurar`);
    fetchData();
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
            <button className="btn-primary new-btn" onClick={() => handleOpenProductModal()}>+ Nuevo Producto</button>
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
                    <td className="actions-cell">
                      <button className="btn-secondary-sm" onClick={() => handleOpenProductModal(p)}>Editar</button>
                      {p.activo ? (
                        <button className="btn-danger-sm" onClick={() => handleDeleteProduct(p._id)}>Dar de baja</button>
                      ) : (
                        <button className="btn-success-sm" onClick={() => handleRestoreProduct(p._id)}>Restaurar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="table-responsive">
            <button className="btn-primary new-btn" onClick={() => handleOpenUserModal()}>+ Nuevo Usuario</button>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u._id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                    <td className="actions-cell">
                      <button className="btn-secondary-sm" onClick={() => handleOpenUserModal(u)}>Editar</button>
                      {u.activo ? (
                        <button className="btn-danger-sm" onClick={() => handleDeleteUser(u._id)}>Dar de baja</button>
                      ) : (
                        <button className="btn-success-sm" onClick={() => handleRestoreUser(u._id)}>Restaurar</button>
                      )}
                    </td>
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

      {/* Modal de Productos */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input required type="text" value={productFormData.nombre} onChange={e => setProductFormData({...productFormData, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input required type="number" value={productFormData.precio} onChange={e => setProductFormData({...productFormData, precio: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <input required type="text" value={productFormData.categoria} onChange={e => setProductFormData({...productFormData, categoria: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input required type="number" value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea required value={productFormData.descripcion} onChange={e => setProductFormData({...productFormData, descripcion: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleCloseProductModal}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Usuarios */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input required type="text" value={userFormData.nombre} onChange={e => setUserFormData({...userFormData, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input required type="password" value={userFormData.contrasena} onChange={e => setUserFormData({...userFormData, contrasena: e.target.value})} />
                </div>
              )}
              <div className="form-group">
                <label>Rol</label>
                <select value={userFormData.rol} onChange={e => setUserFormData({...userFormData, rol: e.target.value})}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={handleCloseUserModal}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
