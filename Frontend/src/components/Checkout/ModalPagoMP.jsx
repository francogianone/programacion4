import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ModalPagoMP.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ModalPagoMP({ url, ventanaCerrada, onCancelar, onPagoExitoso, ordenId }) {
  const [tiempoRestante, setTiempoRestante] = useState(600); // 10 minutos
  const [pagoAprobado, setPagoAprobado] = useState(false);
  const pollRef = useRef(null);

  // Polling directo al backend cada 3 segundos para verificar el estado de la orden
  useEffect(() => {
    if (!ordenId || pagoAprobado) return;

    const verificarOrden = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/ordenes/${ordenId}`);
        const orden = res.data;
        console.log('[ModalMP] Estado orden:', orden.estado, '| MP status:', orden.mercadopagoStatus);

        if (orden.estado === 'confirmada' || orden.mercadopagoStatus === 'approved') {
          setPagoAprobado(true);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (err) {
        console.log('[ModalMP] Error verificando orden:', err.message);
      }
    };

    // Verificar inmediatamente y luego cada 3 segundos
    verificarOrden();
    pollRef.current = setInterval(verificarOrden, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [ordenId, pagoAprobado]);

  // Contador regresivo (solo si no está aprobado)
  useEffect(() => {
    if (ventanaCerrada || pagoAprobado) return;
    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ventanaCerrada, pagoAprobado]);

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  // Auto-redirect después de 20 segundos cuando el pago está aprobado
  useEffect(() => {
    if (!pagoAprobado) return;
    const timeout = setTimeout(() => {
      onPagoExitoso();
    }, 20000);
    return () => clearTimeout(timeout);
  }, [pagoAprobado, onPagoExitoso]);

  // Pago aprobado: mostrar pantalla de éxito
  if (pagoAprobado) {
    return (
      <div className="modal-mp-overlay">
        <div className="modal-mp">
          <div className="modal-mp__icon modal-mp__icon--success">✓</div>
          <h2 className="modal-mp__title">¡Pago completado!</h2>
          <p className="modal-mp__text">
            Tu pago fue procesado correctamente. La orden ya está confirmada.
          </p>
          <p className="modal-mp__timer" style={{ color: '#16a34a' }}>
            Serás redirigido automáticamente en 20 segundos...
          </p>
          <div className="modal-mp__actions">
            <button
              className="modal-mp__btn modal-mp__btn--primary"
              onClick={onPagoExitoso}
            >
              Ver mis compras
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-mp-overlay">
      <div className="modal-mp">
        {!ventanaCerrada ? (
          <>
            <div className="modal-mp__spinner" />
            <h2 className="modal-mp__title">Completá tu pago en Mercado Pago</h2>
            <p className="modal-mp__text">
              Se abrió una nueva pestaña con el checkout de Mercado Pago.
              <br />
              Completá el pago para confirmar tu pedido.
            </p>
            <p className="modal-mp__timer">
              Tiempo estimado: {minutos}:{segundos.toString().padStart(2, '0')}
            </p>

            <div className="modal-mp__actions">
              <button
                className="modal-mp__btn modal-mp__btn--secondary"
                onClick={onCancelar}
              >
                Cancelar pago
              </button>
              <button
                className="modal-mp__btn modal-mp__btn--primary"
                onClick={() => {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                Reabrir Mercado Pago
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-mp__icon modal-mp__icon--warning">⚠</div>
            <h2 className="modal-mp__title">Parece que no completaste el pago</h2>
            <p className="modal-mp__text">
              La ventana de Mercado Pago fue cerrada antes de finalizar el pago.
            </p>

            <div className="modal-mp__actions">
              <button
                className="modal-mp__btn modal-mp__btn--secondary"
                onClick={onCancelar}
              >
                Volver al checkout
              </button>
              <button
                className="modal-mp__btn modal-mp__btn--primary"
                onClick={() => {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                Reintentar pago
              </button>
            </div>

            <button
              className="modal-mp__link"
              onClick={onPagoExitoso}
            >
              Ya pagué, ver mis compras
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalPagoMP;