const mongoose = require('mongoose');

const itemOrdenSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto'
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const datosFacturacionSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  dni:       { type: String, required: true },
  domicilio: { type: String, required: true }
}, { _id: false });

const datosEnvioSchema = new mongoose.Schema({
  domicilio: { type: String, required: true },
  localidad: { type: String, default: '' },
  provincia: { type: String, default: '' },
  cp:        { type: String, default: '' }
}, { _id: false });

const ordenSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  productos: {
    type: [itemOrdenSchema],
    required: true
  },
  costoEnvio: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['transferencia', 'efectivo'],
    required: true
  },
  tipoEntrega: {
    type: String,
    enum: ['envio', 'retiro'],
    required: true
  },
  datosFacturacion: {
    type: datosFacturacionSchema,
    required: true
  },
  datosEnvio: {
    type: datosEnvioSchema,
    default: null
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
