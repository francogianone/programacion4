const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const carritosRoutes = require('./routes/carrito.routes');
const logger = require('./middlewares/logger.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/carritos', carritosRoutes);

module.exports = app;