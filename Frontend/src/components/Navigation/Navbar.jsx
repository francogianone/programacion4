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
        <Link to="/productos" style={{ color: 'inherit', textDecoration: 'none' }}>
          {titulo}
        </Link>
      </h2>

      <ul className="nav-links" style={{ alignItems: 'center' }}>
        <li>
          <Link to="/productos">Productos</Link>
        </li>
        
        {user && user.rol === 'admin' && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}

        {user ? (
          <>
            <li>
              <Link to="/perfil">Mi Perfil</Link>
            </li>
            <li style={{ color: '#ebf3ff', fontSize: '13px', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px' }}>
              👤 {user.nombre}
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'inherit', 
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  opacity: 0.9
                }}
                onMouseOver={(e) => e.target.style.opacity = 1}
                onMouseOut={(e) => e.target.style.opacity = 0.9}
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Ingresar</Link>
            </li>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
          </>
        )}
      </ul>

      <Link to="/carrito" className="cart">Carrito ({cartQuantity})</Link>
    </nav>
  );
}

export default Navbar;