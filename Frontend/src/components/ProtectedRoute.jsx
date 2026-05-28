import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Permite el acceso solo si el usuario está autenticado
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Verificando autenticación...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Permite el acceso solo si el usuario está autenticado y tiene rol 'admin'
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Verificando rol de administrador...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'admin') {
    return <Navigate to="/productos" replace />;
  }

  return children;
}
