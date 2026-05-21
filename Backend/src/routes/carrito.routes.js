const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/auth.middleware');

const {
  obtenerCarrito,
  agregarProductoAlCarrito,
  modificarCantidad,
  eliminarProductoDelCarrito,
  vaciarCarrito
} = require('../controllers/carrito.controller');

// Todas las rutas de carrito requieren estar logueado
router.use(proteger);

router.get('/', obtenerCarrito);
router.post('/productos', agregarProductoAlCarrito);
router.put('/productos/:productoId', modificarCantidad);
router.delete('/productos/:productoId', eliminarProductoDelCarrito);
router.delete('/', vaciarCarrito);

module.exports = router;