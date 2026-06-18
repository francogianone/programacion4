import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Auth.css';
import '../../components/Admin/Admin.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { recuperarContrasena } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Por favor ingresa tu email.');
      setLoading(false);
      return;
    }

    const result = await recuperarContrasena(email);
    setLoading(false);

    if (result.success) {
      if (result.emailEnviado === false) {
        setError('La solicitud se procesó, pero no se pudo enviar el correo de recuperación en este momento. Intentá nuevamente más tarde.');
      } else {
        setSuccess(result.message || 'Se ha enviado un enlace de recuperación a tu correo electrónico.');
      }
      setEmail('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        <p className="profile-sub profile-sub--centered">
          Introduce tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

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
          <button type="submit" className="btn-primary btn-primary--full" disabled={loading}>
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
