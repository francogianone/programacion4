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
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
