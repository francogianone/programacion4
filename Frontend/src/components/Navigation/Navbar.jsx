import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ E-Commerce
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/productos">Productos</Link></li>
          
          {user ? (
            <>
              {user.rol === 'admin' && (
                <li><Link to="/admin" className="admin-link">Panel Admin</Link></li>
              )}
              <li><Link to="/ordenes">Mis Órdenes</Link></li>
              <li><Link to="/perfil">Perfil</Link></li>
              <li>
                <Link to="/carrito" className="cart-link">
                  🛒 <span className="cart-count">{cartItemsCount}</span>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">Salir</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn-login">Ingresar</Link></li>
              <li><Link to="/register" className="btn-register">Crear Cuenta</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;