const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/role.middleware');

const {
  crearOrden,
  obtenerOrdenesUsuario,
  obtenerOrdenPorId,
  obtenerTodasLasOrdenes,
  actualizarEstadoOrden
} = require('../controllers/orden.controller');

// Rutas cliente
router.route('/')
  .post(proteger, crearOrden)
  .get(proteger, obtenerOrdenesUsuario);

router.get('/:id', proteger, obtenerOrdenPorId);

// Rutas admin
router.get('/admin/todas', proteger, admin, obtenerTodasLasOrdenes);
router.put('/:id/estado', proteger, admin, actualizarEstadoOrden);

module.exports = router;
