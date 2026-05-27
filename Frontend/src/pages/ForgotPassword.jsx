import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import '../components/Admin/Admin.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devLink, setDevLink] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { recuperarContrasena } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevLink('');
    setLoading(true);

    if (!email) {
      setError('Por favor ingresa tu email.');
      setLoading(false);
      return;
    }

    const result = await recuperarContrasena(email);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Se ha enviado un enlace de recuperación a tu correo electrónico.');
      setDevLink(result.devLink || '');
      setEmail('');
      console.log('DEV Enlace de recuperación:', result.devLink);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        <p className="profile-sub" style={{ textAlign: 'center', marginBottom: '20px' }}>
          Introduce tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        {devLink && (
          <div style={{
            backgroundColor: '#e3f2fd',
            color: '#0d47a1',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '15px',
            border: '1px solid #bbdefb',
            wordBreak: 'break-all',
            textAlign: 'center'
          }}>
            <strong>Modo Desarrollo (Enlace generado):</strong><br />
            <a href={devLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-block', marginTop: '6px' }}>
              Restablecer contraseña ahora
            </a>
          </div>
        )}

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
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
        </form>
        <div className="auth-footer">
          Volver a <Link to="/login">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
