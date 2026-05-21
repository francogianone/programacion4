import { useState } from 'react';
import api from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const ResetPassword = () => {
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // just to grab user context setter if needed, but normally reset returns token and we can set it

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put(`/usuarios/reset-password/${token}`, { contrasena });
      // Automagically log them in or redirect
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer contraseña');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Nueva Contraseña</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Actualizar Contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
