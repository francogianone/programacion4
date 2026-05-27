import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para edición
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('cliente');
  const [activo, setActivo] = useState(true);
  const [contrasena, setContrasena] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/usuarios`);
      setUsuarios(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.rol === 'admin') {
      fetchUsuarios();
    }
  }, [user]);

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Verificando autenticación...</div>;
  }

  if (!user || user.rol !== 'admin') {
    return (
      <div className="admin-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h2>Acceso Denegado</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Debes ser administrador para ver esta sección.</p>
        </div>
      </div>
    );
  }

  const handleEditClick = (u) => {
    setUsuarioEdit(u);
    setNombre(u.nombre);
    setEmail(u.email);
    setRol(u.rol);
    setActivo(u.activo);
    setContrasena('');
    setSaveSuccess('');
  };

  const handleCancelEdit = () => {
    setUsuarioEdit(null);
    setSaveSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    
    try {
      const payload = {
        nombre,
        email,
        rol,
        activo
      };

      if (contrasena && contrasena.trim() !== '') {
        payload.contrasena = contrasena;
      }

      await axios.put(`${API_URL}/api/usuarios/${usuarioEdit._id}`, payload);
      setSaveSuccess('Usuario actualizado correctamente');
      
      // Refrescar lista y cerrar formulario después de una breve pausa
      setTimeout(() => {
        setUsuarioEdit(null);
        fetchUsuarios();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los cambios del usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Gestión de Usuarios</h2>
          <button className="btn-secondary" onClick={fetchUsuarios}>Refrescar</button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: '20px' }}>{error}</div>}

        {usuarioEdit ? (
          <div className="admin-form">
            <h3 className="admin-form__title">Editar Usuario: {usuarioEdit.nombre}</h3>
            {saveSuccess && <div className="auth-success">{saveSuccess}</div>}
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="orden-estado-select"
                  style={{ width: '100%' }}
                  disabled={usuarioEdit._id === user._id}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
                {usuarioEdit._id === user._id && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    No puedes cambiar tu propio rol de administrador.
                  </span>
                )}
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
                <input
                  id="user-active-checkbox"
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  style={{ width: 'auto', cursor: 'pointer' }}
                  disabled={usuarioEdit._id === user._id}
                />
                <label htmlFor="user-active-checkbox" style={{ cursor: 'pointer' }}>Usuario Activo</label>
                {usuarioEdit._id === user._id && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    (No puedes desactivar tu propia cuenta)
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Cambiar Contraseña (Opcional)</label>
                <input
                  type="password"
                  placeholder="Nueva contraseña (dejar en blanco para no cambiar)"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : (
          loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Cargando listado de usuarios...</div>
          ) : (
            <table className="admin-table">
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
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">No hay usuarios registrados.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 'bold', 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          backgroundColor: u.rol === 'admin' ? '#cce5ff' : '#e2e3e5',
                          color: u.rol === 'admin' ? '#004085' : '#383d41'
                        }}>
                          {u.rol === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.activo ? 'status-enviada' : 'status-cancelada'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEditClick(u)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
