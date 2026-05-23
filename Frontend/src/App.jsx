import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'

function App() {
  return (
    <>
      <Navbar
        titulo="Mi App"
        links={[
          { nombre: 'Inicio', ruta: '/' },
          { nombre: 'Productos', ruta: '/productos' },
          { nombre: 'Contacto', ruta: '/contacto' }
        ]}
      />

      <Routes>
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App

