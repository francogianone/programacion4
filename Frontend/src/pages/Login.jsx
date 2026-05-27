import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import '../components/Admin/Admin.css'; // Para reusar .form-group, .btn-primary

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
      if (result.user.rol === 'admin') {
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Contraseña
              <Link to="/recuperar-contrasena" style={{ fontSize: '11.5px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </label>
            <input
              id="contrasena"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <div className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
