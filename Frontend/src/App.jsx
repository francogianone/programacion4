import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import AdminPanel from './pages/admin/AdminPanel';
import AdminProductos from './pages/admin/AdminProductos';
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminUsers from './pages/admin/AdminUsers';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import MisCompras from './pages/MisCompras/MisCompras';
import Checkout from './pages/Checkout/Checkout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function AppContent() {
  return (
    <>
      <Navbar titulo="Libreria" />

      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/contacto" element={<Contact />} />
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
        <Route 
          path="/mis-compras" 
          element={
            <ProtectedRoute>
              <MisCompras />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
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
