const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const { enviarConfirmacionPedido, enviarActualizacionEstado } = require('../config/mailer');

const crearOrden = async (req, res) => {
  try {
    const { productos, costoEnvio, metodoPago, tipoEntrega, datosFacturacion, datosEnvio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un producto' });
    }

    if (costoEnvio === undefined || costoEnvio < 0) {
      return res.status(400).json({ error: 'costoEnvio es obligatorio y debe ser mayor o igual a 0' });
    }

    if (!metodoPago || !['transferencia', 'efectivo'].includes(metodoPago)) {
      return res.status(400).json({ error: 'metodoPago debe ser "transferencia" o "efectivo"' });
    }

    if (!tipoEntrega || !['envio', 'retiro'].includes(tipoEntrega)) {
      return res.status(400).json({ error: 'tipoEntrega debe ser "envio" o "retiro"' });
    }

    if (
      !datosFacturacion ||
      !datosFacturacion.nombre?.trim() ||
      !datosFacturacion.dni?.trim() ||
      !datosFacturacion.domicilio?.trim()
    ) {
      return res.status(400).json({ error: 'datosFacturacion con nombre, dni y domicilio son obligatorios' });
    }

    if (tipoEntrega === 'envio') {
      if (!datosEnvio || !datosEnvio.domicilio?.trim()) {
        return res.status(400).json({ error: 'El domicilio de envío es obligatorio para envío a domicilio' });
      }
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

      if (producto.stock < Number(cantidad)) {
        return res.status(400).json({
          error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`
        });
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
    const nuevaOrden = new Orden({
      usuario: req.usuario._id,
      productos: itemsResueltos,
      costoEnvio: Number(costoEnvio),
      total,
      metodoPago,
      tipoEntrega,
      datosFacturacion,
      ...(tipoEntrega === 'envio' && { datosEnvio })
    });
    await nuevaOrden.save();

    // Descontar stock de cada producto
    for (const item of itemsResueltos) {
      await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
    }

    // Enviar email de confirmacion al cliente (no bloquea la respuesta)
    try {
      await enviarConfirmacionPedido(req.usuario.email, nuevaOrden);
    } catch (mailError) {
      console.error('Error al enviar email de confirmacion de pedido:', mailError.message);
    }

    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

const obtenerMisOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuario: req.usuario._id, activo: true })
      .populate('productos.producto')
      .sort({ createdAt: -1 });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus compras' });
  }
};

const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ activo: true })
      .populate('usuario', 'nombre email')
      .sort({ createdAt: -1 });
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

    // Notificar al cliente automaticamente al cambiar el estado
    try {
      const usuario = await Usuario.findById(orden.usuario).select('email');
      if (usuario?.email) {
        await enviarActualizacionEstado(usuario.email, orden);
      }
    } catch (mailError) {
      console.error('Error al enviar email de actualizacion de estado:', mailError.message);
    }

    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
};

module.exports = {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden
};
