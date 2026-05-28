import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Auth.css';
import '../../components/Admin/Admin.css';

function ResetPassword() {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { restablecerContrasena } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!token) {
      setError('Token de restablecimiento no válido o ausente.');
      setLoading(false);
      return;
    }

    if (!nuevaContrasena || !confirmarContrasena) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    const result = await restablecerContrasena(token, nuevaContrasena);
    setLoading(false);

    if (result.success) {
      setSuccess('Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Restablecer Contraseña</h2>
        <p className="profile-sub profile-sub--centered">
          Introduce tu nueva contraseña a continuación.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {!token ? (
          <div className="auth-error auth-error--centered">
            El enlace de recuperación es inválido o le falta el token. Por favor solicita uno nuevo.
            <div className="mt-15">
              <Link to="/recuperar-contrasena" className="btn-secondary">
                Solicitar enlace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
              <input
                id="nuevaContrasena"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <input
                id="confirmarContrasena"
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary btn-primary--full" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Contraseña'}
            </button>
          </form>
        )}
        <div className="auth-footer">
          Volver a <Link to="/login">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
