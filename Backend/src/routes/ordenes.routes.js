const express = require('express');
const router = express.Router();

const {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden
} = require('../controllers/ordenes.controller');

router.post('/', crearOrden);
router.get('/', obtenerOrdenes);
router.get('/:id', obtenerOrdenPorId);
router.patch('/:id/estado', actualizarEstadoOrden);

module.exports = router;
