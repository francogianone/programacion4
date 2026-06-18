import { Link, useLocation } from 'react-router-dom';
import './Admin.css';

function AdminNavbar() {
  const { pathname } = useLocation();

  return (
    <div className="admin-navbar">
      <Link to="/admin" className="admin-navbar__title">Panel Admin</Link>
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
        <Link
          to="/admin/usuarios"
          className={`admin-nav-link${pathname.startsWith('/admin/usuarios') ? ' admin-nav-link--active' : ''}`}
        >
          Usuarios
        </Link>
      </nav>
      <Link to="/productos" className="admin-navbar__back">
        Volver al sitio
      </Link>
    </div>
  );
}

export default AdminNavbar;
