const express = require('express');
const router = express.Router();

const { registrarUsuario } = require('../controllers/usuarios.controller');

router.post('/', registrarUsuario);

module.exports = router;