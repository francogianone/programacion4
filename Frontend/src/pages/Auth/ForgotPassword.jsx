import { useState } from 'react';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      const res = await api.post('/usuarios/recuperar-password', { email });
      setMensaje(res.data.mensaje);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar recuperación');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        {error && <div className="auth-error">{error}</div>}
        {mensaje && <div className="auth-success">{mensaje}</div>}
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
          <button type="submit" className="auth-btn">Enviar Enlace</button>
        </form>
        <div className="auth-links">
          <Link to="/login">Volver a Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
