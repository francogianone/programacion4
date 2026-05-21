import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, contrasena) => {
    try {
      const res = await api.post('/usuarios/login', { email, contrasena });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error al iniciar sesión' };
    }
  };

  const register = async (nombre, email, contrasena) => {
    try {
      const res = await api.post('/usuarios/registro', { nombre, email, contrasena });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error al registrarse' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/usuarios/perfil', data);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
       return { success: false, error: error.response?.data?.error || 'Error al actualizar perfil' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
