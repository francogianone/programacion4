import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AdminPanel from './pages/admin/AdminPanel'
import AdminProductos from './pages/admin/AdminProductos'
import AdminOrdenes from './pages/admin/AdminOrdenes'

function App() {
  return (
    <>
      <Navbar
        titulo="Mi App"
        links={[
          { nombre: 'Inicio', ruta: '/' },
          { nombre: 'Productos', ruta: '/productos' },
          { nombre: 'Contacto', ruta: '/contacto' },
          { nombre: 'Admin', ruta: '/admin' }
        ]}
      />

      <Routes>
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/ordenes" element={<AdminOrdenes />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App

