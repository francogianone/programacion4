import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);

  // Cargar token y usuario desde localStorage al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

          // Fetch the latest profile to ensure roles and status are up to date
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const res = await axios.get(`${API_URL}/api/usuarios/perfil`);
          
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Error al verificar la sesión:', error);
          // Si el token expiro o el usuario fue eliminado/desactivado, limpiar sesión
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Iniciar Sesión
  const login = async (email, contrasena) => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/login`, {
        email,
        contrasena
      });

      const { token: receivedToken, usuario: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      return { success: true, user: receivedUser };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: errorMsg };
    }
  };

  // Registrarse
  const register = async (nombre, email, contrasena) => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/registro`, {
        nombre,
        email,
        contrasena
      });

      const { token: receivedToken, usuario: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      return { success: true, user: receivedUser };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al registrarse';
      return { success: false, error: errorMsg };
    }
  };

  // Cerrar Sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Actualizar Perfil propio
  const updateProfile = async (nombre, email, contrasena, contrasenaVieja) => {
    try {
      const payload = { nombre, email };
      if (contrasena && contrasena.trim() !== '') {
        payload.contrasena = contrasena;
        payload.contrasenaVieja = contrasenaVieja;
      }

      const response = await axios.put(`${API_URL}/api/usuarios/perfil`, payload);
      const updatedUser = response.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al actualizar perfil';
      return { success: false, error: errorMsg };
    }
  };

  // Solicitar recuperación de contraseña
  const recuperarContrasena = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/recuperar-contrasena`, { email });
      return { success: true, message: response.data.mensaje };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al solicitar la recuperación';
      return { success: false, error: errorMsg };
    }
  };

  // Restablecer contraseña con el token temporal
  const restablecerContrasena = async (token, nuevaContrasena) => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/restablecer-contrasena`, {
        token,
        nuevaContrasena
      });
      return { success: true, message: response.data.mensaje };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al restablecer la contraseña';
      return { success: false, error: errorMsg };
    }


  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, recuperarContrasena, restablecerContrasena }}>
      {children}
    </AuthContext.Provider>
  );



}

export function useAuth() {
  return useContext(AuthContext);
}
