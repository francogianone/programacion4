import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import { confirmDialog, toastError } from '../../utils/alerts';
import '../../components/Admin/Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [accionando, setAccionando] = useState(null);

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
    return <div className="loading-center">Verificando autenticación...</div>;
  }

  if (!user || user.rol !== 'admin') {
    return (
      <div className="admin-layout admin-layout--center">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Debes ser administrador para ver esta sección.</p>
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

  const handleBaja = async (u) => {
    const ok = await confirmDialog(
      `¿Dar de baja a ${u.nombre}?`,
      'El usuario quedará inactivo y no podrá ingresar al sistema.',
      'Dar de baja'
    );
    if (!ok) return;
    setAccionando(u._id);
    try {
      await axios.patch(`${API_URL}/api/usuarios/${u._id}/baja`);
      fetchUsuarios();
    } catch (err) {
      toastError(err.response?.data?.error || 'Error al dar de baja al usuario');
    } finally {
      setAccionando(null);
    }
  };

  const handleRestaurar = async (u) => {
    const ok = await confirmDialog(
      `¿Restaurar a ${u.nombre}?`,
      'El usuario podrá volver a ingresar al sistema.',
      'Restaurar'
    );
    if (!ok) return;
    setAccionando(u._id);
    try {
      await axios.patch(`${API_URL}/api/usuarios/${u._id}/restaurar`);
      fetchUsuarios();
    } catch (err) {
      toastError(err.response?.data?.error || 'Error al restaurar el usuario');
    } finally {
      setAccionando(null);
    }
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
          <div className="admin-header-actions">
            <button
              className="btn-secondary"
              onClick={() => setMostrarInactivos(v => !v)}
            >
              {mostrarInactivos ? 'Ver activos' : 'Ver inactivos'}
            </button>
            <button className="btn-secondary" onClick={fetchUsuarios}>Refrescar</button>
          </div>
        </div>

        {error && <div className="auth-error auth-error--spaced">{error}</div>}

        {usuarioEdit ? (
          <div className="admin-form">
            <h3 className="admin-form__title">Editar Usuario: {usuarioEdit.nombre}</h3>
            {saveSuccess && <div className="auth-success">{saveSuccess}</div>}
            
            <form onSubmit={handleSave}>
              <div className="form-row">
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="select--full"
                    disabled={usuarioEdit._id === user._id}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {usuarioEdit._id === user._id && (
                    <span className="form-hint">
                      No puedes cambiar tu propio rol.
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Cambiar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Estado</label>
                <div>
                  <button
                    type="button"
                    className={activo ? 'btn-restore' : 'btn-delete'}
                    onClick={async () => {
                      if (usuarioEdit._id === user._id) return;
                      const nuevoEstado = !activo;
                      const ok = await confirmDialog(
                        nuevoEstado ? `¿Activar a ${nombre}?` : `¿Desactivar a ${nombre}?`,
                        nuevoEstado
                          ? 'El usuario podrá ingresar al sistema.'
                          : 'El usuario no podrá ingresar al sistema.',
                        nuevoEstado ? 'Activar' : 'Desactivar'
                      );
                      if (ok) setActivo(nuevoEstado);
                    }}
                    disabled={usuarioEdit._id === user._id}
                  >
                    {activo ? 'Activo' : 'Inactivo'}
                  </button>
                  {usuarioEdit._id === user._id && (
                    <span className="form-hint" style={{ marginTop: 0, marginLeft: 10 }}>
                      (No puedes desactivarte)
                    </span>
                  )}
                </div>
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
            <div className="table-loading">Cargando listado de usuarios...</div>
          ) : (
          <div className="admin-table-container">
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
                  usuarios
                    .filter(u => mostrarInactivos ? !u.activo : u.activo)
                    .map((u) => (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.rol === 'admin' ? 'role-badge--admin' : 'role-badge--client'}`}>
                          {u.rol === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.activo ? 'status-enviada' : 'status-cancelada'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="table-actions">
                        <button className="btn-edit" onClick={() => handleEditClick(u)}>
                          Editar
                        </button>
                        {u.activo && u._id !== user._id && (
                          <button
                            className="btn-delete"
                            onClick={() => handleBaja(u)}
                            disabled={accionando === u._id}
                          >
                            {accionando === u._id ? '...' : 'Dar de baja'}
                          </button>
                        )}
                        {!u.activo && (
                          <button
                            className="btn-restore"
                            onClick={() => handleRestaurar(u)}
                            disabled={accionando === u._id}
                          >
                            {accionando === u._id ? '...' : 'Restaurar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
