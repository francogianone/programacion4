import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Auth.css';
import '../../components/Admin/Admin.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !contrasena) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    const result = await login(email, contrasena);
    setLoading(false);

    if (result.success) {
      if (redirectTo) {
        navigate(redirectTo);
      } else if (result.user.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/productos');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label--row">
              Contraseña
              <Link to="/recuperar-contrasena">
                ¿Olvidaste tu contraseña?
              </Link>
            </label>
            <div className="input-wrapper">
              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-wrapper__toggle"
                onClick={() => setMostrarContrasena((v) => !v)}
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarContrasena ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-primary--full"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-separator">
          <hr />
          <span>¿Eres nuevo?</span>
          <hr />
        </div>

        <Link to="/register" className="auth-new-account-link">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}

export default Login;
