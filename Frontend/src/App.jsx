import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'

import Profile from './pages/User/Profile'
import Orders from './pages/User/Orders'
import Cart from './pages/Cart'

import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/Navigation/ProtectedRoute'

function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/ordenes" element={<Orders />} />
            <Route path="/carrito" element={<Cart />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
