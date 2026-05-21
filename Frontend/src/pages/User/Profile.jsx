import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const data = { nombre };
    if (contrasena) {
      data.contrasena = contrasena;
    }

    const res = await updateProfile(data);
    if (res.success) {
      setMensaje('Perfil actualizado correctamente');
      setContrasena('');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mi Perfil</h2>
        {error && <div className="error-msg">{error}</div>}
        {mensaje && <div className="success-msg">{mensaje}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email (no editable)</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>
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
            <label>Nueva Contraseña (opcional)</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
            />
          </div>
          <button type="submit" className="save-btn">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
