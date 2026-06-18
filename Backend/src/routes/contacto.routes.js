const express = require('express');
const { enviarMensaje } = require('../controllers/contacto.controller');
const router = express.Router();

router.post('/', enviarMensaje);

module.exports = router;
