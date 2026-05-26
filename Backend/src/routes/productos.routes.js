const express = require('express');
const router = express.Router();

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
router.get('/inactivos', obtenerProductosInactivos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.patch('/:id/restaurar', restaurarProducto);

module.exports = router;
