import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar({ titulo, links, cantidadCarrito }) {
  return (
    <nav className="navbar">
      <h2>{titulo}</h2>

      <ul className="nav-links">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.ruta}>{link.nombre}</Link>
          </li>
        ))}
      </ul>

      <div className="cart">Carrito{cantidadCarrito}</div>
    </nav>
  )
}

export default Navbar