import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext.jsx';
import './Checkout.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PagoResultado() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();

  // Mercado Pago redirige con collection_id, status, merchant_order_id, etc.
  // Nuestro back_url incluye orden_id
  const ordenId = searchParams.get('orden_id');

  console.log('[PagoResultado] Query params:', Object.fromEntries(searchParams.entries()));
  console.log('[PagoResultado] orden_id:', ordenId);

  const estadoInicial = !ordenId
    ? 'error'
    : !user
      ? 'error'
      : 'verificando';

  const [estado, setEstado] = useState(estadoInicial);
  const [orden, setOrden] = useState(null);
  const [error, setError] = useState(
    !ordenId
      ? 'No se recibió información del pago. Query: ' + JSON.stringify(Object.fromEntries(searchParams.entries()))
      : !user
        ? 'Debés iniciar sesión para ver el resultado.'
        : ''
  );

  useEffect(() => {
    if (!ordenId || !user) return;

    const verificar = async () => {
      try {
        // 1. Obtener la orden para acceder a su mercadopagoPreferenceId
        const ordenRes = await axios.get(`${API_URL}/api/ordenes/${ordenId}`);
        const ordenData = ordenRes.data;

        if (!ordenData.mercadopagoPreferenceId) {
          setEstado('pending');
          setOrden(ordenData);
          return;
        }

        // 2. Verificar el pago usando el preferenceId
        const pagoRes = await axios.get(
          `${API_URL}/api/ordenes/verificar-pago/${ordenData.mercadopagoPreferenceId}`
        );
        const pagoStatus = pagoRes.data.pago.status;

        setOrden(pagoRes.data.orden);
        setEstado(pagoStatus);

        // Si el pago fue aprobado, vaciar carrito
        if (pagoStatus === 'approved') {
          clearCart();
        }
      } catch (err) {
        setEstado('error');
        setError(err.response?.data?.error || 'Error al verificar el pago.');
      }
    };

    verificar();
  }, [ordenId, user]);

  const configPorEstado = {
    approved: {
      icon: '✓',
      titulo: '¡Pago aprobado!',
      mensaje: 'Tu pago fue procesado correctamente. La orden ya está confirmada.',
      claseIcon: 'pago-resultado__icon--success',
      color: '#16a34a',
      bg: '#dcfce7'
    },
    rejected: {
      icon: '✕',
      titulo: 'Pago rechazado',
      mensaje: 'El pago fue rechazado por la entidad financiera. Intentá con otro medio de pago.',
      claseIcon: 'pago-resultado__icon--error',
      color: '#dc2626',
      bg: '#fef2f2'
    },
    pending: {
      icon: '⏳',
      titulo: 'Pago pendiente',
      mensaje: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
      claseIcon: 'pago-resultado__icon--pending',
      color: '#d97706',
      bg: '#fffbeb'
    },
    in_process: {
      icon: '⏳',
      titulo: 'Pago en proceso',
      mensaje: 'Tu pago está en revisión. Te notificaremos cuando se confirme.',
      claseIcon: 'pago-resultado__icon--pending',
      color: '#d97706',
      bg: '#fffbeb'
    },
    verificando: {
      icon: '⟳',
      titulo: 'Verificando pago...',
      mensaje: 'Estamos chequeando el estado de tu pago.',
      claseIcon: 'pago-resultado__icon--pending',
      color: '#6b7280',
      bg: '#f3f4f6'
    },
    error: {
      icon: '⚠',
      titulo: 'Error',
      mensaje: error || 'Ocurrió un error al verificar el pago.',
      claseIcon: 'pago-resultado__icon--error',
      color: '#dc2626',
      bg: '#fef2f2'
    }
  };

  const config = configPorEstado[estado] || configPorEstado.error;

  return (
    <div className="checkout-confirmacion pago-resultado">
      <div className="checkout-confirmacion__card">
        <div
          className={`checkout-confirmacion__icon ${config.claseIcon}`}
          style={{ background: config.bg, color: config.color }}
        >
          {config.icon}
        </div>
        <h2>{config.titulo}</h2>
        <p className="checkout-confirmacion__sub">{config.mensaje}</p>

        {orden && (
          <div className="pago-resultado__orden-info">
            <p>Orden <strong>#{orden._id.slice(-6).toUpperCase()}</strong></p>
            <p>Total: <strong>${orden.total.toLocaleString('es-AR')}</strong></p>
            <p>Estado: <strong>{orden.estado}</strong></p>
          </div>
        )}

        <div className="pago-resultado__acciones">
          <Link to="/mis-compras" className="btn-primary checkout-confirmacion__btn">
            Ver mis compras
          </Link>
          {estado !== 'approved' && (
            <Link to="/productos" className="btn-secondary">
              Seguir comprando
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PagoResultado;