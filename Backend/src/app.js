const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const carritosRoutes = require('./routes/carrito.routes');
const ordenesRoutes = require('./routes/ordenes.routes');
const contactoRoutes = require('./routes/contacto.routes');
const logger = require('./middlewares/logger.middleware');

const app = express();

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://programacion4.vercel.app',
    /^https:\/\/programacion4-.*\.vercel\.app$/,
    ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
        : []),
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = ALLOWED_ORIGINS.some(o =>
            o instanceof RegExp ? o.test(origin) : o === origin
        );
        if (allowed) return callback(null, true);
        callback(new Error(`CORS bloqueado para el origen: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());
app.use(logger);

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/carritos', carritosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/contacto', contactoRoutes);

module.exports = app;