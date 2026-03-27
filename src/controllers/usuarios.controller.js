const Usuario = require('../models/Usuario');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Nombre, email y contrasena son obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena,
      rol
    });

    await nuevoUsuario.save();

    res.status(201).json({
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = {
  registrarUsuario
};