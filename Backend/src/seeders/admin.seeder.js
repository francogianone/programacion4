require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/database');
const Usuario = require('../models/Usuario');

const seedAdmin = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    const adminEmail = 'admin@app.com';
    const adminExistente = await Usuario.findOne({ email: adminEmail });

    if (adminExistente) {
      console.log('✓ El usuario administrador ya existe:', adminEmail);
      mongoose.connection.close();
      process.exit(0);
    }

    // Encriptar la contraseña por defecto
    const contrasenaPorDefecto = 'admin123';
    const hashContrasena = await bcrypt.hash(contrasenaPorDefecto, 10);

    const nuevoAdmin = new Usuario({
      nombre: 'Administrador',
      email: adminEmail,
      contrasena: hashContrasena,
      rol: 'admin',
      activo: true
    });

    await nuevoAdmin.save();
    console.log('✓ Usuario administrador creado con éxito!');
    console.log('Email:', adminEmail);
    console.log('Contraseña:', contrasenaPorDefecto);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seeder de administrador:', error);
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
