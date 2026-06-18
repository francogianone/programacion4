const nodemailer = require('nodemailer');

const enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const destino = process.env.GMAIL_USER;

    await transporter.sendMail({
      from: `"${nombre}" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: destino,
      subject: `Nuevo mensaje de contacto de: ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #3b5249; border-bottom: 2px solid #edf2f0; padding-bottom: 10px;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #faf9f7; border-left: 4px solid #3b5249; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;">${mensaje}</p>
          </div>
        </div>
      `
    });

    res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje. Intenta más tarde.' });
  }
};

module.exports = {
  enviarMensaje
};
