import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Footer/Footer'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'

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
        cantidadCarrito={0}
      />

      <Routes>
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
