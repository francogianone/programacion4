import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home">

      <section className="home-hero">
        <div className="home-hero__inner">
          <p className="home-hero__eyebrow">Librería online · Argentina</p>
          <h1 className="home-hero__title">
            Los libros que<br />te están esperando.
          </h1>
          <p className="home-hero__subtitle">
            Encontrá tu próxima lectura en nuestro catálogo cuidadosamente seleccionado. Envíos a todo el país.
          </p>
          <div className="home-hero__cta">
            <Link to="/productos" className="home-hero__btn-primary">
              Ver catálogo
              <ArrowRight size={16} />
            </Link>
            <Link to="/contacto" className="home-hero__btn-secondary">Contactarnos</Link>
          </div>
        </div>


        <div className="home-hero__decoration" aria-hidden="true">
          <div className="home-hero__deco-book home-hero__deco-book--1" />
          <div className="home-hero__deco-book home-hero__deco-book--2" />
          <div className="home-hero__deco-book home-hero__deco-book--3" />
        </div>
      </section>

      <div className="home-divider" />

      <section className="home-features">
        <div className="home-features__inner">
          <div className="home-feature">
            <div className="home-feature__icon">
              <Truck size={22} strokeWidth={1.6} />
            </div>
            <h3 className="home-feature__title">Envíos a todo el país</h3>
            <p className="home-feature__text">Recibí tu pedido donde estés, con seguimiento en tiempo real.</p>
          </div>

          <div className="home-feature">
            <div className="home-feature__icon">
              <ShieldCheck size={22} strokeWidth={1.6} />
            </div>
            <h3 className="home-feature__title">Pagos seguros</h3>
            <p className="home-feature__text">Tus datos siempre protegidos con cifrado de extremo a extremo.</p>
          </div>

          <div className="home-feature">
            <div className="home-feature__icon">
              <Headphones size={22} strokeWidth={1.6} />
            </div>
            <h3 className="home-feature__title">Soporte disponible</h3>
            <p className="home-feature__text">Estamos para ayudarte ante cualquier consulta, cuando lo necesites.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
