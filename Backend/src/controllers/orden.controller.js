const Orden = require('../models/Orden');
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

const crearOrden = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.user._id, activo: true }).populate('productos.producto');
    
    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    let total = 0;
    const productosOrden = [];

    // Verificar stock y calcular total
    for (let item of carrito.productos) {
      const productoDb = await Producto.findById(item.producto._id);
      
      if (!productoDb || !productoDb.activo) {
        return res.status(400).json({ error: `El producto ${item.producto.nombre} ya no está disponible` });
      }

      if (productoDb.stock < item.cantidad) {
        return res.status(400).json({ error: `No hay suficiente stock para ${productoDb.nombre}` });
      }

      total += productoDb.precio * item.cantidad;
      
      productosOrden.push({
        producto: productoDb._id,
        cantidad: item.cantidad,
        precio: productoDb.precio
      });
    }

    // Descontar stock
    for (let item of carrito.productos) {
      const productoDb = await Producto.findById(item.producto._id);
      productoDb.stock -= item.cantidad;
      await productoDb.save();
    }

    // Crear la orden
    const nuevaOrden = new Orden({
      usuario: req.user._id,
      productos: productosOrden,
      total,
      estado: 'pagado' // Simulado
    });

    await nuevaOrden.save();

    // Vaciar el carrito
    carrito.productos = [];
    await carrito.save();

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

const obtenerOrdenesUsuario = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuario: req.user._id }).populate('productos.producto').sort('-createdAt');
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

const obtenerOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id).populate('productos.producto').populate('usuario', 'nombre email');
    
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Solo el usuario que la creó o un admin pueden verla
    if (orden.usuario._id.toString() !== req.user._id.toString() && req.user.rol !== 'admin') {
       return res.status(403).json({ error: 'No autorizado para ver esta orden' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({}).populate('usuario', 'nombre email').sort('-createdAt');
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las órdenes' });
  }
};

const actualizarEstadoOrden = async (req, res) => {
  try {
    const { estado } = req.body;
    const orden = await Orden.findById(req.params.id);

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    orden.estado = estado;
    await orden.save();

    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado de la orden' });
  }
}

module.exports = {
  crearOrden,
  obtenerOrdenesUsuario,
  obtenerOrdenPorId,
  obtenerTodasLasOrdenes,
  actualizarEstadoOrden
};
