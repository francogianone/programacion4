const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_super_seguro', {
    expiresIn: '30d',
  });
};

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

    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena: contrasenaHasheada,
      rol
    });

    await nuevoUsuario.save();

    res.status(201).json({
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      token: generarToken(nuevoUsuario._id)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (usuario && (await bcrypt.compare(contrasena, usuario.contrasena))) {
      if (!usuario.activo) {
         return res.status(401).json({ error: 'Usuario dado de baja. Contacte al administrador.' });
      }

      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        token: generarToken(usuario._id),
      });
    } else {
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const obtenerPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.user._id);

  if (usuario) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
};

const actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.user._id);

  if (usuario) {
    usuario.nombre = req.body.nombre || usuario.nombre;
    if (req.body.contrasena) {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(req.body.contrasena, salt);
    }

    const usuarioActualizado = await usuario.save();

    res.json({
      _id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
      token: generarToken(usuarioActualizado._id),
    });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
};

// Admin roles
const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.find({});
  res.json(usuarios);
};

const actualizarUsuarioAdmin = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (usuario) {
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.email = req.body.email || usuario.email;
    usuario.rol = req.body.rol || usuario.rol;
    if (req.body.activo !== undefined) {
      usuario.activo = req.body.activo;
    }

    const usuarioActualizado = await usuario.save();

    res.json({
      _id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
      activo: usuarioActualizado.activo
    });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
};

const eliminarUsuarioLógico = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (usuario) {
    usuario.activo = false;
    await usuario.save();
    res.json({ mensaje: 'Usuario dado de baja lógicamente' });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
};

const restaurarUsuario = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (usuario) {
    usuario.activo = true;
    await usuario.save();
    res.json({ mensaje: 'Usuario restaurado exitosamente' });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
};

// Forgot Password
const solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res.status(404).json({ error: 'No existe usuario con ese email' });
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  usuario.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  usuario.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await usuario.save();

  // Send email (Simulation via Ethereal or console)
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"E-commerce App" <no-reply@ecommerce.com>',
      to: usuario.email,
      subject: "Recuperación de Contraseña",
      text: `Por favor haz click en este enlace para recuperar tu contraseña: ${resetUrl}`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({ mensaje: 'Email de recuperación enviado' });
  } catch (error) {
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;
    await usuario.save();
    res.status(500).json({ error: 'Email no pudo ser enviado' });
  }
};

const restablecerContrasena = async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const usuario = await Usuario.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!usuario) {
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }

  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(req.body.contrasena, salt);
  usuario.resetPasswordToken = undefined;
  usuario.resetPasswordExpire = undefined;

  await usuario.save();

  res.status(200).json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    token: generarToken(usuario._id),
  });
};

module.exports = {
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
};