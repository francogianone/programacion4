const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/role.middleware');

const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productos.controller');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas solo para admin
router.post('/', proteger, admin, crearProducto);
router.put('/:id', proteger, admin, actualizarProducto);
router.delete('/:id', proteger, admin, eliminarProducto);

module.exports = router;
