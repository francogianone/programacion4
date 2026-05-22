const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/role.middleware');

const {
  obtenerProductos,
  obtenerTodosLosProductosAdmin,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarProducto
} = require('../controllers/productos.controller');

router.get('/', obtenerProductos);
router.get('/admin/todos', proteger, admin, obtenerTodosLosProductosAdmin);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas solo para admin
router.post('/', proteger, admin, crearProducto);
router.put('/:id', proteger, admin, actualizarProducto);
router.delete('/:id', proteger, admin, eliminarProducto);
router.put('/:id/restaurar', proteger, admin, restaurarProducto);

module.exports = router;
