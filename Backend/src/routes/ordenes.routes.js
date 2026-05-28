const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

const {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden
} = require('../controllers/ordenes.controller');

router.post('/', autenticar, crearOrden);
router.get('/mis-compras', autenticar, obtenerMisOrdenes);
router.get('/', autenticar, autorizar('admin'), obtenerOrdenes);
router.get('/:id', autenticar, obtenerOrdenPorId);
router.patch('/:id/estado', autenticar, autorizar('admin'), actualizarEstadoOrden);

module.exports = router;
