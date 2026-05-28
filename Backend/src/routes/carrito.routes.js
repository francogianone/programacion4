const express = require('express');
const router = express.Router();
const { autenticar } = require('../middlewares/auth.middleware');

const {
  crearCarrito,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  modificarCantidadProducto,
  vaciarCarrito
} = require('../controllers/carrito.controller');

router.post('/', autenticar, crearCarrito);
router.post('/:id/productos', autenticar, agregarProductoAlCarrito);
router.delete('/:id/productos/:productoId', autenticar, eliminarProductoDelCarrito);
router.patch('/:id/productos/:productoId', autenticar, modificarCantidadProducto);
router.delete('/:id', autenticar, vaciarCarrito);

module.exports = router;
