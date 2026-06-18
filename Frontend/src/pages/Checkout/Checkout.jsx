import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext.jsx';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const COSTO_ENVIO = 2000;

const DATOS_BANCARIOS = {
  alias: 'mi.tienda.alias',
  cbu: '0000003100012345678901',
  banco: 'Banco Nación',
  titular: 'Mi Tienda S.A.'
};

const factVacia = { nombre: '', dni: '', domicilio: '' };
const envioVacio = { domicilio: '', localidad: '', provincia: '', cp: '' };

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [facturacion, setFacturacion] = useState(factVacia);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [datosEnvio, setDatosEnvio] = useState(envioVacio);
  const [usarDatosFact, setUsarDatosFact] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [error, setError] = useState('');

  const costoEnvio = tipoEntrega === 'envio' ? COSTO_ENVIO : 0;
  const total = cartTotal + costoEnvio;

  useEffect(() => {
    if (cartItems.length === 0 && !confirmacion) {
      navigate('/carrito');
    }
  }, [cartItems, confirmacion, navigate]);

  const handleFactChange = (e) => {
    setFacturacion(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEnvioChange = (e) => {
    setDatosEnvio(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcesando(true);

    const envioPayload = usarDatosFact
      ? { domicilio: facturacion.domicilio, localidad: '', provincia: '', cp: '' }
      : datosEnvio;

    try {
      const payload = {
        productos: cartItems.map(item => ({
          productoId: item.id || item._id,
          cantidad: item.quantity
        })),
        costoEnvio,
        metodoPago,
        tipoEntrega,
        datosFacturacion: facturacion,
        ...(tipoEntrega === 'envio' && { datosEnvio: envioPayload })
      };

      const res = await axios.post(`${API_URL}/api/ordenes`, payload);
      clearCart();
      setConfirmacion({ orden: res.data, metodoPago, emailNotificado: res.data.emailNotificado !== false });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  if (confirmacion) {
    return (
      <div className="checkout-confirmacion">
        <div className="checkout-confirmacion__card">
          <div className="checkout-confirmacion__icon">✓</div>
          <h2>¡Pedido recibido!</h2>
          <p className="checkout-confirmacion__sub">
            Tu pedido <strong>#{confirmacion.orden._id.slice(-8).toUpperCase()}</strong> fue registrado correctamente.
          </p>

          {!confirmacion.emailNotificado && (
            <p className="checkout-confirmacion__email-warning">
              ⚠ No se pudo enviar la confirmación por email. Tu pedido está registrado sin inconvenientes — el aviso de correo es temporal.
            </p>
          )}

          {confirmacion.metodoPago === 'transferencia' && (
            <div className="checkout-datos-bancarios">
              <h3>Datos para la transferencia</h3>
              <div className="checkout-datos-bancarios__grid">
                <span className="checkout-datos-bancarios__label">Alias</span>
                <span className="checkout-datos-bancarios__valor">{DATOS_BANCARIOS.alias}</span>
                <span className="checkout-datos-bancarios__label">CBU</span>
                <span className="checkout-datos-bancarios__valor">{DATOS_BANCARIOS.cbu}</span>
                <span className="checkout-datos-bancarios__label">Banco</span>
                <span className="checkout-datos-bancarios__valor">{DATOS_BANCARIOS.banco}</span>
                <span className="checkout-datos-bancarios__label">Titular</span>
                <span className="checkout-datos-bancarios__valor">{DATOS_BANCARIOS.titular}</span>
              </div>
              <p className="checkout-datos-bancarios__nota">
                Una vez realizada la transferencia, el equipo confirmará tu pedido.
              </p>
            </div>
          )}

          <Link to="/mis-compras" className="btn-primary checkout-confirmacion__btn">
            Ver mis compras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Finalizar Compra</h2>
      <div className="checkout-layout">

        <form className="checkout-form" onSubmit={handleSubmit}>

          {/* FACTURACIÓN */}
          <section className="checkout-section">
            <h3 className="checkout-section__title">Datos de facturación</h3>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                name="nombre"
                type="text"
                value={facturacion.nombre}
                onChange={handleFactChange}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="form-group">
              <label>DNI</label>
              <input
                name="dni"
                type="text"
                value={facturacion.dni}
                onChange={handleFactChange}
                placeholder="12345678"
                required
              />
            </div>
            <div className="form-group">
              <label>Domicilio</label>
              <input
                name="domicilio"
                type="text"
                value={facturacion.domicilio}
                onChange={handleFactChange}
                placeholder="Av. Siempreviva 742, Springfield"
                required
              />
            </div>
          </section>

          {/* MÉTODO DE PAGO */}
          <section className="checkout-section">
            <h3 className="checkout-section__title">Método de pago</h3>
            <div className="checkout-radio-group">
              <label className={`checkout-radio-option${metodoPago === 'efectivo' ? ' checkout-radio-option--active' : ''}`}>
                <input
                  type="radio"
                  value="efectivo"
                  checked={metodoPago === 'efectivo'}
                  onChange={() => setMetodoPago('efectivo')}
                />
                Efectivo en el local
              </label>
              <label className={`checkout-radio-option${metodoPago === 'transferencia' ? ' checkout-radio-option--active' : ''}`}>
                <input
                  type="radio"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={() => setMetodoPago('transferencia')}
                />
                Transferencia bancaria
              </label>
            </div>
          </section>

          {/* TIPO DE ENTREGA */}
          <section className="checkout-section">
            <h3 className="checkout-section__title">Tipo de entrega</h3>
            <div className="checkout-radio-group">
              <label className={`checkout-radio-option${tipoEntrega === 'retiro' ? ' checkout-radio-option--active' : ''}`}>
                <input
                  type="radio"
                  value="retiro"
                  checked={tipoEntrega === 'retiro'}
                  onChange={() => setTipoEntrega('retiro')}
                />
                Retiro en local <span className="checkout-radio-option__tag">Sin costo</span>
              </label>
              <label className={`checkout-radio-option${tipoEntrega === 'envio' ? ' checkout-radio-option--active' : ''}`}>
                <input
                  type="radio"
                  value="envio"
                  checked={tipoEntrega === 'envio'}
                  onChange={() => setTipoEntrega('envio')}
                />
                Envío a domicilio <span className="checkout-radio-option__tag">+${COSTO_ENVIO.toLocaleString('es-AR')}</span>
              </label>
            </div>

            {tipoEntrega === 'envio' && (
              <div className="checkout-envio-form">
                <label className="checkout-checkbox">
                  <input
                    type="checkbox"
                    checked={usarDatosFact}
                    onChange={(e) => setUsarDatosFact(e.target.checked)}
                  />
                  Usar el domicilio de facturación
                </label>

                {!usarDatosFact && (
                  <>
                    <div className="form-group">
                      <label>Domicilio de envío</label>
                      <input
                        name="domicilio"
                        type="text"
                        value={datosEnvio.domicilio}
                        onChange={handleEnvioChange}
                        placeholder="Calle y número"
                        required
                      />
                    </div>
                    <div className="checkout-row">
                      <div className="form-group">
                        <label>Localidad</label>
                        <input
                          name="localidad"
                          type="text"
                          value={datosEnvio.localidad}
                          onChange={handleEnvioChange}
                          placeholder="Buenos Aires"
                        />
                      </div>
                      <div className="form-group">
                        <label>Provincia</label>
                        <input
                          name="provincia"
                          type="text"
                          value={datosEnvio.provincia}
                          onChange={handleEnvioChange}
                          placeholder="CABA"
                        />
                      </div>
                      <div className="form-group">
                        <label>Código postal</label>
                        <input
                          name="cp"
                          type="text"
                          value={datosEnvio.cp}
                          onChange={handleEnvioChange}
                          placeholder="1414"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary checkout-submit-btn"
            disabled={procesando || cartItems.length === 0}
          >
            {procesando ? 'Procesando...' : 'Realizar pedido'}
          </button>
        </form>

        {/* SIDEBAR RESUMEN */}
        <aside className="checkout-sidebar">
          <div className="checkout-resumen">
            <h3 className="checkout-resumen__title">Tu pedido</h3>
            <ul className="checkout-resumen__list">
              {cartItems.map(item => (
                <li key={item.id || item._id} className="checkout-resumen__item">
                  <span className="checkout-resumen__item-nombre">{item.nombre} <span className="checkout-resumen__item-qty">x{item.quantity}</span></span>
                  <span>${(item.precio * item.quantity).toLocaleString('es-AR')}</span>
                </li>
              ))}
            </ul>
            <div className="checkout-resumen__row">
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="checkout-resumen__row">
              <span>Envío</span>
              <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString('es-AR')}`}</span>
            </div>
            <div className="checkout-resumen__row checkout-resumen__total">
              <span>Total</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default Checkout;
