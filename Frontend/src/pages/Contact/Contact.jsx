import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setForm({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2>Contacto</h2>
        <p className="contact-sub">
          Completá el formulario y nos comunicaremos a la brevedad.
        </p>

        {enviado && (
          <div className="contact-success">
            Tu mensaje fue enviado. Te responderemos pronto.
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              placeholder="¿En qué podemos ayudarte?"
              value={form.mensaje}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="contact-btn">Enviar mensaje</button>
        </form>

        <div className="contact-info">
          <p>También podés escribirnos a <strong>contacto@miapp.com</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
