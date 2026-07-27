const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

const {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  cotizarEnvioHandler,
  verificarPago
} = require('../controllers/ordenes.controller');

// Ruta pública de cotización (sin auth, accesible desde el carrito)
router.get('/cotizar-envio', cotizarEnvioHandler);

// Verificación de pago de Mercado Pago (requiere auth)
router.get('/verificar-pago/:preferenceId', autenticar, verificarPago);

router.post('/', autenticar, crearOrden);
router.get('/mis-compras', autenticar, obtenerMisOrdenes);
router.get('/', autenticar, autorizar('admin'), obtenerOrdenes);
router.get('/:id', autenticar, obtenerOrdenPorId);
router.patch('/:id/estado', autenticar, autorizar('admin'), actualizarEstadoOrden);

module.exports = router;
