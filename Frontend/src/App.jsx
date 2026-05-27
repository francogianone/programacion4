import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';
import AdminProductos from './pages/admin/AdminProductos';
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminUsers from './pages/admin/AdminUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function AppContent() {
  return (
    <>
      <Navbar titulo="Mi App" />

      <Routes>
        {/* Redirigir inicio a productos */}
        <Route path="/" element={<Navigate to="/productos" replace />} />
        
        {/* Rutas Públicas */}
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
        <Route path="/restablecer-contrasena" element={<ResetPassword />} />

        {/* Rutas Privadas de Usuario Cliente */}
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Rutas Privadas de Administrador */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/productos" 
          element={
            <AdminRoute>
              <AdminProductos />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/ordenes" 
          element={
            <AdminRoute>
              <AdminOrdenes />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/usuarios" 
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } 
        />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
