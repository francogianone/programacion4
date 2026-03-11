const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const logger = require('./middlewares/logger.middleware');

const app = express();

// Middleware global
app.use(express.json());
app.use(logger);

// Rutas
app.use('/api/productos', productosRoutes);

module.exports = app;
