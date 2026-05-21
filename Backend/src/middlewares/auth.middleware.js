const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');

      req.user = await Usuario.findById(decoded.id).select('-contrasena');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'No autorizado, no hay token' });
  }
};

module.exports = { proteger };
