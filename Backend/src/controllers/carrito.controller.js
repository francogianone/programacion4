const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

const obtenerCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuario: req.user._id, activo: true }).populate('productos.producto');
    
    if (!carrito) {
      carrito = new Carrito({ usuario: req.user._id, productos: [] });
      await carrito.save();
    }
    
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

const agregarProductoAlCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ error: 'productoId y cantidad son obligatorios' });
    }

    let carrito = await Carrito.findOne({ usuario: req.user._id, activo: true });
    if (!carrito) {
      carrito = new Carrito({ usuario: req.user._id, productos: [] });
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
    await carrito.populate('productos.producto');
    
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

const modificarCantidad = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    let carrito = await Carrito.findOne({ usuario: req.user._id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const indice = carrito.productos.findIndex(
      item => item.producto.toString() === productoId
    );

    if (indice >= 0) {
      if (cantidad <= 0) {
        carrito.productos.splice(indice, 1);
      } else {
        carrito.productos[indice].cantidad = Number(cantidad);
      }
      await carrito.save();
      await carrito.populate('productos.producto');
      res.status(200).json(carrito);
    } else {
      res.status(404).json({ error: 'Producto no está en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al modificar cantidad' });
  }
};

const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const { productoId } = req.params;

    let carrito = await Carrito.findOne({ usuario: req.user._id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    carrito.productos = carrito.productos.filter(
      item => item.producto.toString() !== productoId
    );

    await carrito.save();
    await carrito.populate('productos.producto');
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuario: req.user._id, activo: true });
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    carrito.productos = [];
    await carrito.save();
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
};

module.exports = {
  obtenerCarrito,
  agregarProductoAlCarrito,
  modificarCantidad,
  eliminarProductoDelCarrito,
  vaciarCarrito
};