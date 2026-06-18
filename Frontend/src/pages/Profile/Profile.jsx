import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../Auth.css';
import '../../components/Admin/Admin.css';
import './Profile.css';

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
    return <div className="loading-center">Cargando perfil...</div>;
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card profile-card--centered">
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

          <div className="profile-password-section">
            <h3 className="profile-password-section__title">Cambiar Contraseña (Opcional)</h3>
            
            <div className="form-group">
              <label htmlFor="contrasena">Nueva Contraseña</label>
              <input
                id="contrasena"
                type="password"
                placeholder="Dejar en blanco para no cambiarla"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="new-password"
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
                autoComplete="new-password"
              />
            </div>

            {contrasena && contrasena.trim() !== '' && (
              <div className="form-group form-group--highlighted">
                <label htmlFor="contrasenaVieja">Contraseña Actual</label>
                <input
                  id="contrasenaVieja"
                  type="password"
                  placeholder="Contraseña actual"
                  value={contrasenaVieja}
                  onChange={(e) => setContrasenaVieja(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary btn-primary--full" disabled={loading}>
            {loading ? 'Guardando Cambios...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
