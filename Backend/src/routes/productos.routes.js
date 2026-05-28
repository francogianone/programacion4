const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

const {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosInactivos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarProducto
} = require('../controllers/productos.controller');

router.get('/', obtenerProductos);
router.get('/inactivos', autenticar, autorizar('admin'), obtenerProductosInactivos);
router.get('/:id', obtenerProductoPorId);
router.post('/', autenticar, autorizar('admin'), crearProducto);
router.put('/:id', autenticar, autorizar('admin'), actualizarProducto);
router.delete('/:id', autenticar, autorizar('admin'), eliminarProducto);
router.patch('/:id/restaurar', autenticar, autorizar('admin'), restaurarProducto);

module.exports = router;
