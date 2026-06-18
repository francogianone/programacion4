import './Footer.css';
import { Link } from 'react-router-dom';
import { Mail, AtSign, BookOpen } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <div className="footer__logo">
            <BookOpen size={20} strokeWidth={1.8} />
            <span>Páginas</span>
          </div>
          <p className="footer__tagline">Tu librería online. Cada libro, una historia.</p>
        </div>


        <nav className="footer__nav" aria-label="Footer navigation">
          <h3 className="footer__nav-title">Tienda</h3>
          <ul role="list">
            <li><Link to="/productos" className="footer__link">Catálogo</Link></li>
            <li><Link to="/carrito" className="footer__link">Carrito</Link></li>
            <li><Link to="/mis-compras" className="footer__link">Mis Compras</Link></li>
          </ul>
        </nav>

        <nav className="footer__nav" aria-label="Footer navigation cuenta">
          <h3 className="footer__nav-title">Cuenta</h3>
          <ul role="list">
            <li><Link to="/login" className="footer__link">Ingresar</Link></li>
            <li><Link to="/register" className="footer__link">Registrarse</Link></li>
            <li><Link to="/perfil" className="footer__link">Mi Perfil</Link></li>
          </ul>
        </nav>


        <div className="footer__contact">
          <h3 className="footer__nav-title">Contacto</h3>
          <a href="mailto:contacto@paginas.com" className="footer__contact-link">
            <Mail size={15} />
            contacto@paginas.com
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__contact-link">
            <AtSign size={15} />
            libreriaapaginas
          </a>
          <Link to="/contacto" className="footer__link" style={{ marginTop: '8px', display: 'block' }}>Formulario de contacto</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Páginas · Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
