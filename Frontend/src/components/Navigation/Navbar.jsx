import './Navbar.css';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
} from 'lucide-react';

function Logo() {
  return (
    <Link to="/" className="navbar__logo" aria-label="Páginas — Inicio">
      <svg
        className="navbar__logo-icon"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="12" y="3" width="2.5" height="22" rx="1" fill="currentColor" />
        <path d="M12 5 C8 5 4 7 4 14 C4 21 8 23 12 23 L12 5Z" fill="currentColor" opacity="0.55" />
        <path d="M14.5 5 C18.5 5 24 7 24 14 C24 21 18.5 23 14.5 23 L14.5 5Z" fill="currentColor" opacity="0.85" />
      </svg>
      <span className="navbar__logo-text">Páginas</span>
    </Link>
  );
}

function Navbar() {
  const { cartQuantity } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <nav className="navbar__inner" aria-label="Navegación principal">
          <Logo />

          <ul className="navbar__links" role="list">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Inicio</NavLink></li>
            <li><NavLink to="/productos" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Catálogo</NavLink></li>
            <li><NavLink to="/contacto" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Contacto</NavLink></li>
            {user && (
              <li><NavLink to="/mis-compras" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Mis Compras</NavLink></li>
            )}
          </ul>

          <div className="navbar__actions">
            {user && user.rol === 'admin' && (
              <Link to="/admin" className="navbar__action-link navbar__action-link--icon" title="Panel Admin">
                <LayoutDashboard size={18} />
              </Link>
            )}
            <Link to="/carrito" className="navbar__action-link navbar__cart" aria-label={`Carrito (${cartQuantity} items)`}>
              <ShoppingCart size={18} />
              {cartQuantity > 0 && (
                <span className="navbar__cart-badge">{cartQuantity}</span>
              )}
            </Link>
            {user ? (
              <div className="navbar__user">
                <Link to="/perfil" className="navbar__action-link navbar__action-link--icon" title="Mi Perfil">
                  <User size={18} />
                </Link>
                <span className="navbar__username">{user.nombre.split(' ')[0]}</span>
                <button
                  className="navbar__action-link navbar__action-link--icon navbar__logout"
                  onClick={handleLogout}
                  title="Salir"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="navbar__auth">
                <Link to="/login" className="navbar__link">Ingresar</Link>
                <Link to="/register" className="navbar__btn-cta">Registrarse</Link>
              </div>
            )}

            <button
              className={`navbar__hamburger ${isOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`navbar__overlay ${isOpen ? 'navbar__overlay--visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ul className="navbar__mobile-links" role="list">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}>Inicio</NavLink></li>
          <li><NavLink to="/productos" className={({ isActive }) => isActive ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}>Catálogo</NavLink></li>
          <li><NavLink to="/contacto" className={({ isActive }) => isActive ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}>Contacto</NavLink></li>
          {user && (
            <li><NavLink to="/mis-compras" className={({ isActive }) => isActive ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}>Mis Compras</NavLink></li>
          )}
          {user && user.rol === 'admin' && (
            <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'navbar__mobile-link navbar__mobile-link--active' : 'navbar__mobile-link'}><LayoutDashboard size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />Panel Admin</NavLink></li>
          )}
        </ul>

        <div className="navbar__mobile-divider" />

        <div className="navbar__mobile-actions">
          <Link to="/carrito" className="navbar__mobile-cart">
            <ShoppingCart size={17} />
            Carrito
            {cartQuantity > 0 && <span className="navbar__cart-badge">{cartQuantity}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/perfil" className="navbar__mobile-link">
                <User size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Mi Perfil — {user.nombre.split(' ')[0]}
              </Link>
              <button className="navbar__mobile-logout" onClick={handleLogout}>
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link">Ingresar</Link>
              <Link to="/register" className="navbar__mobile-cta">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;