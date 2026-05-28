import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar({ titulo }) {
  const { cartQuantity } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          {titulo}
        </Link>
      </h2>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Catálogo</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        {user && (
          <li><Link to="/mis-compras">Mis Compras</Link></li>
        )}
        {user && user.rol === 'admin' && (
          <li><Link to="/admin">Panel Admin</Link></li>
        )}
      </ul>

      <ul className="nav-actions">
        <li>
          <Link to="/carrito" className="cart">Carrito ({cartQuantity})</Link>
        </li>
        {user ? (
          <>
            <li><Link to="/perfil">Mi Perfil</Link></li>
            <li className="nav-username">{user.nombre}</li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Ingresar</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;