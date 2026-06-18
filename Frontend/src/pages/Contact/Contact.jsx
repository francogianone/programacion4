import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Contact.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/contacto`, form);
      setForm({ nombre: '', email: '', mensaje: '' });
      if (res.data.emailEnviado === false) {
        Swal.fire({
          title: 'Mensaje recibido',
          text: 'Recibimos tu consulta, pero no pudimos enviarte una notificación por email en este momento. Nos comunicaremos a la brevedad.',
          icon: 'warning',
          confirmButtonColor: 'var(--brand)',
          confirmButtonText: 'Aceptar'
        });
      } else {
        Swal.fire({
          title: '¡Mensaje enviado!',
          text: 'Hemos recibido tu consulta y te responderemos a la brevedad.',
          icon: 'success',
          confirmButtonColor: 'var(--brand)',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Intenta nuevamente más tarde.',
        icon: 'error',
        confirmButtonColor: 'var(--brand)',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2>Contacto</h2>
        <p className="contact-sub">
          Completá el formulario y nos comunicaremos a la brevedad.
        </p>


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

          <button type="submit" className="contact-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>

        <div className="contact-info">
          <p>También podés escribirnos a <strong>contacto@miapp.com</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
