const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findOne({ _id: req.params.id, activo: true });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, descripcion } = req.body;

    if (!nombre || precio === undefined || !categoria) {
      return res.status(400).json({ error: 'Nombre, precio y categoria son obligatorios' });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio,
      categoria,
      descripcion
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, descripcion } = req.body;

    const producto = await Producto.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { nombre, precio, categoria, descripcion },
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { activo: false },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
    }

    res.status(200).json({ mensaje: 'Producto dado de baja logicamente', producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al dar de baja producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};