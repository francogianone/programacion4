const express = require('express');
const router = express.Router();

const {
  crearCarrito,
  agregarProductoAlCarrito
} = require('../controllers/carrito.controller');

router.post('/', crearCarrito);
router.post('/:id/productos', agregarProductoAlCarrito);

module.exports = router;