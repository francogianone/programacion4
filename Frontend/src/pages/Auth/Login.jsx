import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, contrasena);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            <label>Contraseña</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Ingresar</button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
