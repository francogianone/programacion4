import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const camposVacios = { nombre: '', precio: '', categoria: '', descripcion: '', stock: '', imagen: '' };

function ProductForm({ modo = 'crear', productoInicial = null, onSuccess }) {
  // EXTRAE EL TOKEN DESDE EL CONTEXTO
  const { token } = useAuth();

  const [form, setForm] = useState(
    productoInicial
      ? {
        nombre: productoInicial.nombre,
        precio: productoInicial.precio,
        categoria: productoInicial.categoria,
        descripcion: productoInicial.descripcion || '',
        stock: productoInicial.stock !== undefined ? productoInicial.stock : 0,
        imagen: productoInicial.imagen || ''
      }
      : camposVacios
  );
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token actual del contexto:", token);
    setEnviando(true);


    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      if (modo === 'crear') {
        await axios.post(`${API_URL}/api/productos`, {
          ...form,
          precio: Number(form.precio),
          stock: Number(form.stock || 0)
        }, config);

        alert('Producto creado correctamente');
        setForm(camposVacios);
      } else {
        await axios.put(`${API_URL}/api/productos/${productoInicial._id}`, {
          ...form,
          precio: Number(form.precio),
          stock: Number(form.stock || 0)
        }, config);

        alert('Producto actualizado correctamente');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error inesperado';
      alert(`Error: ${mensaje}`);
    } finally {
      setEnviando(false);
    }
  };


  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3 className="admin-form__title">
        {modo === 'crear' ? 'Nuevo producto' : 'Editar producto'}
      </h3>

      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0"
          value={form.precio}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoria</label>
        <input
          id="categoria"
          name="categoria"
          type="text"
          value={form.categoria}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripcion</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imagen">URL de imagen</label>
        <input
          id="imagen"
          name="imagen"
          type="text"
          value={form.imagen}
          onChange={handleChange}
          placeholder="https://"
        />
      </div>

      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={enviando}>
          {enviando ? 'Guardando...' : modo === 'crear' ? 'Crear producto' : 'Guardar cambios'}
        </button>
        {onSuccess && (
          <button type="button" className="btn-secondary" onClick={onSuccess}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
