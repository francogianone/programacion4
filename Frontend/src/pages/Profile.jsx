import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import '../components/Admin/Admin.css';

function Profile() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [contrasenaVieja, setContrasenaVieja] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Cargando perfil...</div>;
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card" style={{ textAlign: 'center' }}>
          <h2>Acceso Denegado</h2>
          <p className="profile-sub">Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nombre || !email) {
      setError('El nombre y el email son obligatorios.');
      setLoading(false);
      return;
    }

    if (contrasena) {
      if (!contrasenaVieja || contrasenaVieja.trim() === '') {
        setError('Debes ingresar tu contraseña actual para cambiarla.');
        setLoading(false);
        return;
      }
      if (contrasena !== confirmarContrasena) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }
      if (contrasena.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }
    }

    const result = await updateProfile(nombre, email, contrasena, contrasenaVieja);
    setLoading(false);

    if (result.success) {
      setSuccess('Perfil actualizado con éxito.');
      setContrasena('');
      setConfirmarContrasena('');
      setContrasenaVieja('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mi Perfil</h2>
        <p className="profile-sub">Edita tus datos personales básicos o cambia tu contraseña.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-main)' }}>Cambiar Contraseña (Opcional)</h3>
            
            <div className="form-group">
              <label htmlFor="contrasena">Nueva Contraseña</label>
              <input
                id="contrasena"
                type="password"
                placeholder="Dejar en blanco si no quieres cambiarla"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
              <input
                id="confirmarContrasena"
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
              />
            </div>

            {contrasena && contrasena.trim() !== '' && (
              <div className="form-group" style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '10px', marginTop: '10px' }}>
                <label htmlFor="contrasenaVieja" style={{ fontWeight: 'bold' }}>Contraseña Actual</label>
                <input
                  id="contrasenaVieja"
                  type="password"
                  placeholder="Introduce tu contraseña actual para autorizar el cambio"
                  value={contrasenaVieja}
                  onChange={(e) => setContrasenaVieja(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', marginTop: '15px' }} disabled={loading}>
            {loading ? 'Guardando Cambios...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
