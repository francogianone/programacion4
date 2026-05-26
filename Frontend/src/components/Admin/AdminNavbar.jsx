import { Link, useLocation } from 'react-router-dom';
import './Admin.css';

function AdminNavbar() {
  const { pathname } = useLocation();

  return (
    <div className="admin-navbar">
      <span className="admin-navbar__title">Panel Admin</span>
      <nav className="admin-navbar__links">
        <Link
          to="/admin/productos"
          className={`admin-nav-link${pathname.startsWith('/admin/productos') ? ' admin-nav-link--active' : ''}`}
        >
          Productos
        </Link>
        <Link
          to="/admin/ordenes"
          className={`admin-nav-link${pathname === '/admin/ordenes' ? ' admin-nav-link--active' : ''}`}
        >
          Ordenes
        </Link>
      </nav>
      <Link to="/productos" className="admin-navbar__back">
        Volver al sitio
      </Link>
    </div>
  );
}

export default AdminNavbar;
