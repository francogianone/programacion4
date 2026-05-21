const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'No autorizado, se requiere rol de administrador' });
  }
};

module.exports = { admin };
