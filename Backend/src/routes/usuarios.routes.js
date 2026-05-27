const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil,
  obtenerUsuarios,
  actualizarUsuario,
  recuperarContrasena,
  restablecerContrasena
} = require('../controllers/usuarios.controller');

const { autenticar, autorizar } = require('../middlewares/auth.middleware');

// Rutas Públicas
router.post('/', registrarUsuario); // Para mantener retrocompatibilidad si es necesario
router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/recuperar-contrasena', recuperarContrasena);
router.post('/restablecer-contrasena', restablecerContrasena);

// Rutas de Usuario Autenticado
router.get('/perfil', autenticar, obtenerPerfil);
router.put('/perfil', autenticar, actualizarPerfil);

// Rutas de Administrador
router.get('/', autenticar, autorizar('admin'), obtenerUsuarios);
router.put('/:id', autenticar, autorizar('admin'), actualizarUsuario);

module.exports = router;