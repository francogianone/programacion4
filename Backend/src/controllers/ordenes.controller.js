const Orden = require('../models/Orden');
const Producto = require('../models/Producto');

const crearOrden = async (req, res) => {
  try {
    const { productos, costoEnvio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un producto' });
    }

    if (costoEnvio === undefined || costoEnvio < 0) {
      return res.status(400).json({ error: 'costoEnvio es obligatorio y debe ser mayor o igual a 0' });
    }

    const itemsResueltos = [];
    let subtotal = 0;

    for (const item of productos) {
      const { productoId, cantidad } = item;

      if (!productoId || !cantidad || cantidad < 1) {
        return res.status(400).json({ error: 'Cada item requiere productoId y cantidad valida' });
      }

      const producto = await Producto.findOne({ _id: productoId, activo: true });
      if (!producto) {
        return res.status(404).json({ error: `Producto ${productoId} no encontrado o inactivo` });
      }

      itemsResueltos.push({
        producto: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: Number(cantidad)
      });

      subtotal += producto.precio * Number(cantidad);
    }

    const total = subtotal + Number(costoEnvio);
    const nuevaOrden = new Orden({ productos: itemsResueltos, costoEnvio: Number(costoEnvio), total });
    await nuevaOrden.save();

    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ activo: true }).sort({ createdAt: -1 });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ordenes' });
  }
};

const obtenerOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findOne({ _id: req.params.id, activo: true });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

const actualizarEstadoOrden = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'];

    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: `Estado invalido. Opciones: ${estadosValidos.join(', ')}` });
    }

    const orden = await Orden.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { estado },
      { new: true }
    );

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden
};
