const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Generar Token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET || 'supersecrettokenkey123',
    { expiresIn: '7d' }
  );
};

// Registro de usuario (Público, rol por defecto: cliente)
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Nombre, email y contrasena son obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena: hash,
      rol: 'cliente' // Fuerza el rol a cliente para registros públicos
    });

    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      token,
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Inicio de sesión (Público)
const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contrasena son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(400).json({ error: 'Usuario inactivo' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.status(200).json({
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario fue cargado por el middleware "autenticar"
    res.status(200).json(req.usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Editar perfil del usuario autenticado
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email, contrasena, contrasenaVieja } = req.body;
    const usuarioId = req.usuario._id;

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    const emailExistente = await Usuario.findOne({ email, _id: { $ne: usuarioId } });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya esta registrado por otro usuario' });
    }

    const datosActualizados = { nombre, email };

    // Si envía una nueva contraseña, validamos la contraseña vieja
    if (contrasena && contrasena.trim() !== '') {
      if (!contrasenaVieja || contrasenaVieja.trim() === '') {
        return res.status(400).json({ error: 'Debes proporcionar tu contraseña actual para cambiarla' });
      }

      // Buscar el usuario con la contraseña para comparar
      const usuarioDb = await Usuario.findById(usuarioId);
      if (!usuarioDb) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(contrasenaVieja, usuarioDb.contrasena);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
      }

      datosActualizados.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      datosActualizados,
      { new: true, runValidators: true }
    ).select('-contrasena');

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Ver listado de usuarios (Admin solamente)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contrasena');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listado de usuarios' });
  }
};

// Editar cualquier usuario (Admin solamente)
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, activo, contrasena } = req.body;

    if (!nombre || !email || !rol) {
      return res.status(400).json({ error: 'Nombre, email y rol son obligatorios' });
    }

    // Si el administrador se está editando a sí mismo, no puede cambiar su rol ni desactivarse
    if (id === req.usuario._id.toString()) {
      if (rol !== 'admin') {
        return res.status(400).json({ error: 'No puedes cambiar tu propio rol de administrador' });
      }
      if (activo === false) {
        return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
      }
    }

    // Verificar si el email ya está en uso por otro usuario
    const emailExistente = await Usuario.findOne({ email, _id: { $ne: id } });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya esta registrado por otro usuario' });
    }

    const datosActualizados = { nombre, email, rol, activo };

    // Si el administrador cambia la contraseña del usuario
    if (contrasena && contrasena.trim() !== '') {
      datosActualizados.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    ).select('-contrasena');

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Solicitud de recuperación de contraseña (usando Formspree)
const recuperarContrasena = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Respondemos exitoso por seguridad de enumeración de emails
      return res.status(200).json({ mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación.' });
    }

    // Generar un token aleatorio y expiración
    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const expiracion = Date.now() + 3600000; // 1 hora de validez

    usuario.restablecerContrasenaToken = token;
    usuario.restablecerContrasenaExpiracion = expiracion;
    await usuario.save();

    // Crear el enlace temporal de restablecimiento
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const enlaceRestablecer = `${frontendUrl}/restablecer-contrasena?token=${token}`;

    // Enviar correo a través de Formspree
    // Formspree connection string: https://formspree.io/f/mkoepewg
    try {
      await fetch('https://formspree.io/f/mkoepewg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: usuario.email,
          _subject: 'Recuperar contraseña - Mi App',
          mensaje: `Has solicitado restablecer tu contraseña para tu cuenta de Mi App. Haz clic en el siguiente enlace para hacerlo: ${enlaceRestablecer}`,
          enlace: enlaceRestablecer
        })
      });
      console.log(`✓ Solicitud de recuperación enviada a Formspree para: ${usuario.email}`);
      console.log(`[DEV] Enlace de recuperación: ${enlaceRestablecer}`);
    } catch (formspreeError) {
      console.error('Error al enviar formulario a Formspree:', formspreeError.message);
    }

    res.status(200).json({ 
      mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación.',
      devLink: enlaceRestablecer
    });
  } catch (error) {
    console.error('Error en recuperarContrasena:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de recuperación' });
  }
};

// Restablecer contraseña con token temporal
const restablecerContrasena = async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;

    if (!token || !nuevaContrasena) {
      return res.status(400).json({ error: 'El token y la nueva contraseña son obligatorios' });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Buscar usuario con token válido y que no haya expirado
    const usuario = await Usuario.findOne({
      restablecerContrasenaToken: token,
      restablecerContrasenaExpiracion: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'El token es inválido o ha expirado' });
    }

    // Encriptar nueva contraseña
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    usuario.contrasena = hash;
    
    // Limpiar campos de recuperación
    usuario.restablecerContrasenaToken = undefined;
    usuario.restablecerContrasenaExpiracion = undefined;
    
    await usuario.save();

    res.status(200).json({ mensaje: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil,
  obtenerUsuarios,
  actualizarUsuario,
  recuperarContrasena,
  restablecerContrasena
};