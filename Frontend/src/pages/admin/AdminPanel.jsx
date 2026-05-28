import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import '../../components/Admin/Admin.css';

function AdminPanel() {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Panel de Administracion</h2>
        </div>
        <div className="admin-panel-cards">
          <Link to="/admin/productos" className="admin-card">
            <h3>Productos</h3>
            <p>Crear, editar, dar de baja y restaurar productos del catalogo</p>
          </Link>
          <Link to="/admin/ordenes" className="admin-card">
            <h3>Ordenes de Compra</h3>
            <p>Ver y gestionar el estado de las ordenes recibidas</p>
          </Link>
          <Link to="/admin/usuarios" className="admin-card">
            <h3>Usuarios</h3>
            <p>Ver listado de usuarios, editar sus perfiles y cambiar sus roles</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
