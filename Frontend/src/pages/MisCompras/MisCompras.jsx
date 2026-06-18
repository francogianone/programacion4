import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../../context/CartContext.jsx';
import { PageLoader } from '../../components/UI/PageLoader';
import { Package, BadgeCheck } from 'lucide-react';
import './MisCompras.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ESTADO_LABELS = {
  pendiente: 'Pago pendiente',
  confirmada: 'Compra confirmada',
  enviada: 'En camino',
  entregada: 'Entregado',
  cancelada: 'Cancelado'
};

const ESTADO_CLASES = {
  pendiente: 'estado-ml-pendiente',
  confirmada: 'estado-ml-confirmada',
  enviada: 'estado-ml-enviada',
  entregada: 'estado-ml-entregada',
  cancelada: 'estado-ml-cancelada'
};

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandida, setExpandida] = useState(null);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/ordenes/mis-compras`);
        setCompras(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar tus compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const formatFecha = (isoString) => {
    const fecha = new Date(isoString);
    const opciones = { day: 'numeric', month: 'long' };
    return fecha.toLocaleDateString('es-AR', opciones);
  };

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);

  const handleVolverAComprar = (compra) => {
    let faltantes = false;

    compra.productos.forEach((item) => {
      const prodDb = item.producto;
      
      if (!prodDb || prodDb.stock <= 0) {
        faltantes = true;
        const dummyProduct = {
          id: prodDb ? prodDb._id : item._id,
          _id: prodDb ? prodDb._id : item._id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: prodDb ? prodDb.imagen : null,
          stock: 0,
          agotado: true
        };
        addToCart(dummyProduct, item.cantidad);
      } else {
        addToCart(prodDb, item.cantidad);
      }
    });

    if (faltantes) {
      Swal.fire({
        title: 'Atención con el stock',
        text: 'Algunos productos de tu compra original ya no están disponibles o no tienen stock. Se han añadido a tu carrito en estado "Agotado".',
        icon: 'warning',
        confirmButtonText: 'Ir al carrito',
        confirmButtonColor: 'var(--brand)'
      }).then(() => navigate('/carrito'));
    } else {
      navigate('/carrito');
    }
  };

  const handleVolverAComprarUnico = (item) => {
    const prodDb = item.producto;
    
    if (!prodDb || prodDb.stock <= 0) {
      const dummyProduct = {
        id: prodDb ? prodDb._id : item._id,
        _id: prodDb ? prodDb._id : item._id,
        nombre: item.nombre,
        precio: item.precio,
        imagen: prodDb ? prodDb.imagen : null,
        stock: 0,
        agotado: true
      };
      addToCart(dummyProduct, item.cantidad);
      Swal.fire({
        title: 'Atención con el stock',
        text: 'Este producto ya no está disponible o no tiene stock. Se ha añadido a tu carrito en estado "Agotado".',
        icon: 'warning',
        confirmButtonText: 'Ir al carrito',
        confirmButtonColor: 'var(--brand)'
      }).then(() => navigate('/carrito'));
    } else {
      addToCart(prodDb, item.cantidad);
      navigate('/carrito');
    }
  };

  return (
    <div className="mis-compras-wrapper">
      <main className="mis-compras-container">
          <div className="mis-compras-header">
            <h1 className="mis-compras-titulo">Compras</h1>
          </div>

          {loading && <PageLoader text="Cargando tus compras..." />}

          {error && (
            <p className="mis-compras-estado mis-compras-error">{error}</p>
          )}

          {!loading && !error && compras.length === 0 && (
            <div className="mis-compras-vacio">
              <Package size={64} color="#ccc" strokeWidth={1} />
              <h2>Aún no tienes compras</h2>
              <p>¡Explora nuestro catálogo y encuentra lo que buscas!</p>
              <Link to="/productos" className="btn-primary mis-compras-vacio__btn">
                Descubrir productos
              </Link>
            </div>
          )}

          {!loading && !error && compras.length > 0 && (
            <div className="compras-lista-ml">
              {compras.map((compra) => {
                const isExpanded = expandida === compra._id;
                const productosMostrados = isExpanded ? compra.productos : compra.productos.slice(0, 1);

                return (
                  <div key={compra._id} className="compra-ml">
                    <div className="compra-ml__header">
                      <span className="compra-ml__fecha">{formatFecha(compra.createdAt)}</span>
                    </div>

                    <div className="compra-ml__body">
                      {productosMostrados.map((item, i) => (
                        <div key={i} className={`compra-ml__item-row ${i > 0 ? 'compra-ml__item-row--divider' : ''}`}>
                          <div className="compra-ml__image-container">
                            {item.producto?.imagen ? (
                              <img src={item.producto.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : (
                              <Package size={36} color="#d1d1d1" strokeWidth={1.2} />
                            )}
                          </div>

                          <div className="compra-ml__info">
                            {i === 0 && (
                              <>
                                <span className={`compra-ml__status ${ESTADO_CLASES[compra.estado]}`}>
                                  {ESTADO_LABELS[compra.estado] || compra.estado}
                                </span>
                                <span className="compra-ml__title">
                                  {compra.estado === 'entregada' ? `Llegó el ${formatFecha(compra.createdAt)}` : `Orden #${compra._id.slice(-8).toUpperCase()}`}
                                </span>
                              </>
                            )}
                            
                            <span className="compra-ml__product-name" style={{ marginTop: i > 0 ? '4px' : '0' }}>{item.nombre}</span>
                            <span className="compra-ml__product-meta">
                              {item.cantidad} u. | Total: {formatPrecio(item.precio * item.cantidad)}
                            </span>
                            {!isExpanded && compra.productos.length > 1 && (
                              <span className="compra-ml__more-items">
                                y {compra.productos.length - 1} producto(s) más...
                              </span>
                            )}
                          </div>

                          <div className="compra-ml__actions">
                            {i === 0 ? (
                              <>
                                <button 
                                  className="btn-ml-solid" 
                                  onClick={() => setExpandida(isExpanded ? null : compra._id)}
                                >
                                  {isExpanded ? 'Ocultar detalle' : 'Ver compra'}
                                </button>
                                <button className="btn-ml-light" onClick={() => handleVolverAComprar(compra)}>Volver a comprar</button>
                              </>
                            ) : (
                              <button className="btn-ml-light" onClick={() => handleVolverAComprarUnico(item)}>Volver a comprar</button>
                            )}
                          </div>
                        </div>
                      ))}

                      {isExpanded && (
                        <div className="compra-ml__expanded-details">
                          <h4 className="compra-ml__details-title">Detalle de la orden</h4>
                          <div className="compra-ml__details-grid">
                            <div className="compra-ml__detail-block">
                              <span className="compra-ml__detail-label">Método de pago:</span>
                              <span className="compra-ml__detail-value">
                                {compra.metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo'}
                              </span>
                            </div>
                            <div className="compra-ml__detail-block">
                              <span className="compra-ml__detail-label">Tipo de entrega:</span>
                              <span className="compra-ml__detail-value">
                                {compra.tipoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en sucursal'}
                              </span>
                            </div>
                            {compra.tipoEntrega === 'envio' && compra.datosEnvio && (
                              <div className="compra-ml__detail-block">
                                <span className="compra-ml__detail-label">Dirección de envío:</span>
                                <span className="compra-ml__detail-value">
                                  {compra.datosEnvio.domicilio} {compra.datosEnvio.localidad && `, ${compra.datosEnvio.localidad}`}
                                </span>
                              </div>
                            )}
                            <div className="compra-ml__detail-block">
                              <span className="compra-ml__detail-label">Total pagado:</span>
                              <span className="compra-ml__detail-value font-bold">
                                {formatPrecio(compra.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}

export default MisCompras;
