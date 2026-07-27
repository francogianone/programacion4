const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const { enviarConfirmacionPedido, enviarActualizacionEstado } = require('../config/mailer');
const { cotizarEnvio } = require('../services/envio.service');
const { crearPreferencia } = require('../services/mercadopago.service');

const crearOrden = async (req, res) => {
  try {
    const { productos, costoEnvio, metodoPago, tipoEntrega, datosFacturacion, datosEnvio } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un producto' });
    }

    if (costoEnvio === undefined || costoEnvio < 0) {
      return res.status(400).json({ error: 'costoEnvio es obligatorio y debe ser mayor o igual a 0' });
    }

    if (!metodoPago || !['transferencia', 'efectivo', 'mercadopago'].includes(metodoPago)) {
      return res.status(400).json({ error: 'metodoPago debe ser "transferencia", "efectivo" o "mercadopago"' });
    }

    if (!tipoEntrega || !['envio', 'retiro', 'correo'].includes(tipoEntrega)) {
      return res.status(400).json({ error: 'tipoEntrega debe ser "envio", "retiro" o "correo"' });
    }

    if (
      !datosFacturacion ||
      !datosFacturacion.nombre?.trim() ||
      !datosFacturacion.dni?.trim() ||
      !datosFacturacion.domicilio?.trim()
    ) {
      return res.status(400).json({ error: 'datosFacturacion con nombre, dni y domicilio son obligatorios' });
    }

    // Validar datos de envío para envio y correo
    if (tipoEntrega === 'envio' || tipoEntrega === 'correo') {
      if (!datosEnvio || !datosEnvio.domicilio?.trim()) {
        return res.status(400).json({ error: 'El domicilio de envío es obligatorio para esta modalidad de entrega' });
      }
      if (!datosEnvio.cp || !/^\d{4}$/.test(datosEnvio.cp)) {
        return res.status(400).json({ error: 'El código postal es obligatorio y debe ser un CP argentino de 4 dígitos' });
      }
    }

    // Validar costoEnvio contra el servicio de cotización (anti-manipulación)
    if (tipoEntrega !== 'retiro') {
      const cotizacionEsperada = cotizarEnvio(datosEnvio.cp, tipoEntrega);
      if (!cotizacionEsperada || Number(costoEnvio) !== cotizacionEsperada.costoEnvio) {
        return res.status(400).json({
          error: 'El costo de envío no coincide con la cotización actual. Vuelva a cotizar.',
          costoEsperado: cotizacionEsperada?.costoEnvio
        });
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
      ...((tipoEntrega === 'envio' || tipoEntrega === 'correo') && { datosEnvio })
    });
    await nuevaOrden.save();

    // Descontar stock de cada producto
    for (const item of itemsResueltos) {
      await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
    }

    // Enviar email de confirmacion al cliente (no bloquea la respuesta)
    let emailNotificado = true;
    try {
      await enviarConfirmacionPedido(req.usuario.email, nuevaOrden);
    } catch (mailError) {
      emailNotificado = false;
      console.error('Error al enviar email de confirmacion de pedido:', mailError.message);
    }

    // Si el metodo de pago es Mercado Pago, generar preferencia
    let initPoint = null;
    if (metodoPago === 'mercadopago') {
      try {
        const preferencia = await crearPreferencia(nuevaOrden);
        initPoint = preferencia.init_point;
        nuevaOrden.mercadopagoPreferenceId = preferencia.preferenceId;
        nuevaOrden.mercadopagoStatus = 'pending';
        await nuevaOrden.save();
      } catch (mpError) {
        console.error('[MercadoPago] Error al crear preferencia:', mpError.message);
        if (mpError.cause) {
          console.error('[MercadoPago] Causa:', JSON.stringify(mpError.cause, null, 2));
        }
        return res.status(502).json({
          error: 'No se pudo iniciar el pago con Mercado Pago. Intente nuevamente.',
          detalle: mpError.message
        });
      }
    }

    res.status(201).json({
      ...nuevaOrden.toObject(),
      emailNotificado,
      initPoint
    });
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

    // Solo el dueño de la orden o un admin pueden verla
    if (req.usuario.rol !== 'admin' && orden.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: 'No tienes permisos para ver esta orden' });
    }

    // Si la orden tiene pago de MP pendiente, verificarlo automáticamente
    if (
      orden.mercadopagoPreferenceId &&
      orden.mercadopagoStatus === 'pending' &&
      orden.metodoPago === 'mercadopago'
    ) {
      try {
        const { paymentApi } = require('../config/mercadopago');
        const { results } = await paymentApi.search({
          options: { sort: 'date_created', criteria: 'desc', limit: 20 }
        });
        const pagosOrden = (results || []).filter(
          p => p.external_reference === orden._id.toString()
        );

        if (pagosOrden.length > 0) {
          const ultimoPago = pagosOrden[0];
          const pagoStatus = ultimoPago.status || 'pending';
          console.log(`[MercadoPago] Auto-verificación orden ${orden._id}: ${pagoStatus}`);

          if (pagoStatus === 'approved') {
            orden.mercadopagoStatus = 'approved';
            orden.estado = 'confirmada';
            await orden.save();
          } else if (pagoStatus !== 'pending') {
            orden.mercadopagoStatus = pagoStatus;
            await orden.save();
          }
        }
      } catch (err) {
        console.error('[MercadoPago] Error en auto-verificación:', err.message);
      }
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
    let emailNotificado = true;
    try {
      const usuario = await Usuario.findById(orden.usuario).select('email');
      if (usuario?.email) {
        await enviarActualizacionEstado(usuario.email, orden);
      } else {
        emailNotificado = false;
      }
    } catch (mailError) {
      emailNotificado = false;
      console.error('Error al enviar email de actualizacion de estado:', mailError.message);
    }

    res.status(200).json({ ...orden.toObject(), emailNotificado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
};

const cotizarEnvioHandler = async (req, res) => {
  try {
    const { cp, tipoEntrega } = req.query;

    if (!cp || !tipoEntrega) {
      return res.status(400).json({ error: 'Se requieren cp y tipoEntrega como query params' });
    }

    const tiposValidos = ['envio', 'correo', 'retiro'];
    if (!tiposValidos.includes(tipoEntrega)) {
      return res.status(400).json({ error: `tipoEntrega debe ser uno de: ${tiposValidos.join(', ')}` });
    }

    const resultado = cotizarEnvio(cp, tipoEntrega);
    if (!resultado) {
      return res.status(400).json({ error: 'Código postal inválido. Debe ser un CP argentino de 4 dígitos.' });
    }

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al cotizar el envío' });
  }
};

const verificarPago = async (req, res) => {
  try {
    const { preferenceId } = req.params;

    if (!preferenceId) {
      return res.status(400).json({ error: 'Se requiere el ID de preferencia' });
    }

    // Buscar la orden por el preferenceId
    const orden = await Orden.findOne({
      mercadopagoPreferenceId: preferenceId,
      usuario: req.usuario._id,
      activo: true
    });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada para esta preferencia de pago' });
    }

    // Buscar pagos en Mercado Pago por external_reference = ID de la orden
    const { paymentApi } = require('../config/mercadopago');
    let pagoStatus = 'pending';
    let paymentId = null;

    try {
      const { results } = await paymentApi.search({
        options: { sort: 'date_created', criteria: 'desc', limit: 20 }
      });
      const pagosOrden = (results || []).filter(
        p => p.external_reference === orden._id.toString()
      );

      if (pagosOrden.length > 0) {
        const ultimoPago = pagosOrden[0];
        pagoStatus = ultimoPago.status || 'pending';
        paymentId = ultimoPago.id?.toString() || null;
      }
    } catch (searchError) {
      console.error('[MercadoPago] Error buscando pagos:', searchError.message);
    }

    console.log(`[MercadoPago] Verificación orden ${orden._id}: ${pagoStatus}`);

    // Actualizar orden según resultado
    if (pagoStatus === 'approved' && orden.mercadopagoStatus !== 'approved') {
      orden.mercadopagoStatus = 'approved';
      orden.estado = 'confirmada';
      await orden.save();
    } else if (pagoStatus === 'rejected' && orden.mercadopagoStatus !== 'rejected') {
      orden.mercadopagoStatus = 'rejected';
      await orden.save();
    } else if (pagoStatus && orden.mercadopagoStatus !== pagoStatus) {
      orden.mercadopagoStatus = pagoStatus;
      await orden.save();
    }

    res.status(200).json({
      orden: orden.toObject(),
      pago: {
        status: pagoStatus,
        paymentId
      }
    });
  } catch (error) {
    console.error('[MercadoPago] Error en verificarPago:', error.message);
    res.status(500).json({ error: 'Error al verificar el pago' });
  }
};

module.exports = {
  crearOrden,
  obtenerMisOrdenes,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  cotizarEnvioHandler,
  verificarPago
};
