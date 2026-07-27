import { useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CotizadorEnvio() {
  const { cotizacionEnvio, guardarCotizacion, envioSeleccionado, seleccionarEnvio } = useCart();
  const [cp, setCp] = useState(cotizacionEnvio?.cp || '');
  const [cotizando, setCotizando] = useState(false);
  const [resultados, setResultados] = useState(
    cotizacionEnvio
      ? [
          { tipo: 'retiro', costoEnvio: 0, zona: cotizacionEnvio.zona, label: 'Retiro en local' },
          cotizacionEnvio.envio ? { ...cotizacionEnvio.envio, tipo: 'envio', label: 'Envío a domicilio' } : null,
          cotizacionEnvio.correo ? { ...cotizacionEnvio.correo, tipo: 'correo', label: 'Retiro en correo' } : null,
        ].filter(Boolean)
      : []
  );
  const [error, setError] = useState('');

  const handleCotizar = async () => {
    if (!/^\d{4}$/.test(cp.trim())) {
      setError('Ingresá un código postal argentino de 4 dígitos');
      return;
    }

    setError('');
    setCotizando(true);

    try {
      const [resEnvio, resCorreo] = await Promise.all([
        axios.get(`${API_URL}/api/ordenes/cotizar-envio`, { params: { cp: cp.trim(), tipoEntrega: 'envio' } }),
        axios.get(`${API_URL}/api/ordenes/cotizar-envio`, { params: { cp: cp.trim(), tipoEntrega: 'correo' } }),
      ]);

      const envioData = resEnvio.data;
      const correoData = resCorreo.data;

      const data = [
        { tipo: 'retiro', costoEnvio: 0, zona: envioData.zona, label: 'Retiro en local' },
        { ...envioData, tipo: 'envio', label: 'Envío a domicilio' },
        { ...correoData, tipo: 'correo', label: 'Retiro en correo' },
      ];

      setResultados(data);
      guardarCotizacion({ cp: cp.trim(), zona: envioData.zona, envio: envioData, correo: correoData });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cotizar. Verificá el código postal.');
      setResultados([]);
    } finally {
      setCotizando(false);
    }
  };

  const handleCpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCp(value);
    if (error) setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCotizar();
    }
  };

  const handleSeleccionar = (opcion) => {
    seleccionarEnvio(opcion.tipo, opcion.costoEnvio);
  };

  return (
    <div className="cotizador-envio">
      <h3 className="cotizador-envio__title">Cotizá tu envío</h3>
      <p className="cotizador-envio__desc">
        Ingresá tu código postal para ver las opciones de entrega disponibles.
      </p>

      <div className="cotizador-envio__input-group">
        <input
          type="text"
          inputMode="numeric"
          value={cp}
          onChange={handleCpChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: 3260"
          maxLength={4}
          className="cotizador-envio__input"
        />
        <button
          type="button"
          className="cotizador-envio__btn"
          onClick={handleCotizar}
          disabled={cotizando || cp.length !== 4}
        >
          {cotizando ? 'Cotizando...' : 'Cotizar'}
        </button>
      </div>

      {error && <p className="cotizador-envio__error">{error}</p>}

      {resultados.length > 0 && (
        <div className="cotizador-envio__resultados">
          {resultados.map((opcion) => {
            const estaSeleccionada = envioSeleccionado?.tipo === opcion.tipo;
            return (
              <div
                key={opcion.tipo}
                className={`cotizador-envio__opcion${estaSeleccionada ? ' cotizador-envio__opcion--selected' : ''}`}
                onClick={() => handleSeleccionar(opcion)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSeleccionar(opcion);
                  }
                }}
              >
                <div className="cotizador-envio__opcion-info">
                  <span className="cotizador-envio__opcion-label">{opcion.label}</span>
                  {opcion.tipo !== 'retiro' && (
                    <span className="cotizador-envio__opcion-zona">{opcion.zona}</span>
                  )}
                </div>
                <span className="cotizador-envio__opcion-precio">
                  {opcion.costoEnvio === 0 ? 'Gratis' : `$${opcion.costoEnvio.toLocaleString('es-AR')}`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {envioSeleccionado && (
        <p className="cotizador-envio__seleccion-info">
          ✓ Método seleccionado:{' '}
          <strong>
            {envioSeleccionado.tipo === 'retiro'
              ? 'Retiro en local'
              : envioSeleccionado.tipo === 'correo'
                ? 'Retiro en correo'
                : 'Envío a domicilio'}
          </strong>
        </p>
      )}
    </div>
  );
}

export default CotizadorEnvio;