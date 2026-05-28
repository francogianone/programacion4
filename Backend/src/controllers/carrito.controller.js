const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

const crearCarrito = async (req, res) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({ error: 'El id de usuario es obligatorio' });
    }

    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const nuevoCarrito = new Carrito({ usuario, productos: [] });
    await nuevoCarrito.save();

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ error: 'productoId y cantidad son obligatorios' });
    }

    const carrito = await Carrito.findOne({ _id: id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const producto = await Producto.findOne({ _id: productoId, activo: true });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
    }

    const indice = carrito.productos.findIndex(
      item => item.producto.toString() === productoId
    );

    if (indice >= 0) {
      carrito.productos[indice].cantidad += Number(cantidad);
    } else {
      carrito.productos.push({
        producto: productoId,
        cantidad: Number(cantidad)
      });
    }

    await carrito.save();

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const { id, productoId } = req.params;

    const carrito = await Carrito.findOne({ _id: id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const indice = carrito.productos.findIndex(
      item => item.producto.toString() === productoId
    );

    if (indice === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    carrito.productos.splice(indice, 1);
    await carrito.save();

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

const modificarCantidadProducto = async (req, res) => {
  try {
    const { id, productoId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || Number(cantidad) < 1) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    const carrito = await Carrito.findOne({ _id: id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const producto = await Producto.findOne({ _id: productoId, activo: true });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
    }

    if (producto.stock < Number(cantidad)) {
      return res.status(400).json({
        error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`
      });
    }

    const indice = carrito.productos.findIndex(
      item => item.producto.toString() === productoId
    );

    if (indice === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    carrito.productos[indice].cantidad = Number(cantidad);
    await carrito.save();

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al modificar cantidad del producto' });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const carrito = await Carrito.findOne({ _id: id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    carrito.productos = [];
    await carrito.save();

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

module.exports = {
  crearCarrito,
  agregarProductoAlCarrito,
  eliminarProductoDelCarrito,
  modificarCantidadProducto,
  vaciarCarrito
};