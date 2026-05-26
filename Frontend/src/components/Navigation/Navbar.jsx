import './Navbar.css'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'

function Navbar({ titulo, links }) {
  const { cartQuantity } = useCart();

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

      <Link to="/carrito" className="cart">Carrito ({cartQuantity})</Link>
    </nav>
  )
}

export default Navbar