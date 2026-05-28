import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <h1>Bienvenido a Mi App</h1>
        <p>Encontrá los mejores productos al mejor precio.</p>
        <Link to="/productos" className="home-hero-btn">Ver catálogo</Link>
      </section>

      <section className="home-features">
        <div className="home-feature">
          <h3>Envíos a todo el país</h3>
          <p>Recibí tu pedido donde estés.</p>
        </div>
        <div className="home-feature">
          <h3>Pagos seguros</h3>
          <p>Tus datos siempre protegidos.</p>
        </div>
        <div className="home-feature">
          <h3>Soporte disponible</h3>
          <p>Estamos para ayudarte ante cualquier consulta.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
