const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/role.middleware');

const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  obtenerUsuarios,
  actualizarUsuarioAdmin,
  eliminarUsuarioLógico,
  restaurarUsuario,
  solicitarRecuperacion,
  restablecerContrasena
} = require('../controllers/usuarios.controller');

// Rutas publicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/recuperar-password', solicitarRecuperacion);
router.put('/reset-password/:token', restablecerContrasena);

// Rutas protegidas (cliente/admin)
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);

// Rutas protegidas (solo admin)
router.get('/', proteger, admin, obtenerUsuarios);
router.put('/:id', proteger, admin, actualizarUsuarioAdmin);
router.delete('/:id', proteger, admin, eliminarUsuarioLógico);
router.put('/:id/restaurar', proteger, admin, restaurarUsuario);

module.exports = router;