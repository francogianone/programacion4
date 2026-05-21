import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(nombre, email, contrasena);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
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
            <label>Contraseña</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Registrarse</button>
        </form>
        <div className="auth-links">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
