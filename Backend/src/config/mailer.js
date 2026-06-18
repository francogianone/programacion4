const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// Envuelve sendMail con un timeout de seguridad para evitar que quede
// colgado cuando el host bloquea SMTP (ej: Render plan gratuito).
const sendMailSafe = (opciones) =>
  Promise.race([
    transporter.sendMail(opciones),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout al enviar email (SMTP bloqueado)')), 8000)
    )
  ]);

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(Number(value || 0));

/**
 * Envia email de confirmacion de pedido al cliente.
 * @param {string} emailDestino
 * @param {object} orden - documento de Mongoose guardado
 */
const enviarConfirmacionPedido = async (emailDestino, orden) => {
  const itemsHtml = orden.productos
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${escapeHtml(item.nombre)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.cantidad}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatCurrency(item.precio)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatCurrency(item.precio * item.cantidad)}</td>
        </tr>`
    )
    .join('');

  const entregaLabel =
    orden.tipoEntrega === 'envio' ? 'Envio a domicilio' : 'Retiro en local';
  const pagoLabel =
    orden.metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo';

  await transporter.sendMail({
    from: `"Libreria" <${process.env.GMAIL_USER}>`,
    to: emailDestino,
    subject: `Recibimos tu pedido (#${orden._id.toString().slice(-6).toUpperCase()})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
        <div style="background:#3b5249;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">¡Recibimos tu pedido!</h1>
        </div>
        <div style="padding:28px 32px;">
          <p style="margin-top:0;">Tu pedido fue registrado correctamente. En breve nos ponemos en contacto.</p>

          <h3 style="border-bottom:2px solid #f0f0f0;padding-bottom:8px;">Detalle del pedido</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f7f7f7;">
                <th style="padding:8px 12px;text-align:left;">Producto</th>
                <th style="padding:8px 12px;text-align:center;">Cant.</th>
                <th style="padding:8px 12px;text-align:right;">Precio unit.</th>
                <th style="padding:8px 12px;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <table style="width:100%;font-size:14px;margin-top:12px;">
            <tr>
              <td style="padding:6px 12px;">Costo de envio</td>
              <td style="padding:6px 12px;text-align:right;">${formatCurrency(orden.costoEnvio)}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px;font-weight:bold;font-size:16px;">Total</td>
              <td style="padding:6px 12px;font-weight:bold;font-size:16px;text-align:right;">${formatCurrency(orden.total)}</td>
            </tr>
          </table>

          <h3 style="border-bottom:2px solid #f0f0f0;padding-bottom:8px;margin-top:24px;">Informacion de entrega</h3>
          <p style="font-size:14px;margin:4px 0;"><strong>Tipo de entrega:</strong> ${entregaLabel}</p>
          <p style="font-size:14px;margin:4px 0;"><strong>Metodo de pago:</strong> ${pagoLabel}</p>

          <p style="margin-top:28px;font-size:13px;color:#888;">
            Si tenes alguna duda podes contactarnos respondiendo este email.
          </p>
        </div>
        <div style="background:#f7f7f7;padding:16px 32px;font-size:12px;color:#aaa;text-align:center;">
          Libreria – Programacion IV TUP UTN FRCU 2026
        </div>
      </div>
    `
  });
};

/**
 * Envia email de actualizacion de estado de orden al cliente.
 * @param {string} emailDestino
 * @param {object} orden - documento de Mongoose
 */
const enviarActualizacionEstado = async (emailDestino, orden) => {
  const mensajesPorEstado = {
    pendiente:  'Tu pedido esta pendiente de confirmacion.',
    confirmada: 'Tu pago fue confirmado. Estamos preparando tu pedido.',
    enviada:    'Tu pedido ya esta en camino. Pronto llegara a tu domicilio.',
    entregada:  'Tu pedido fue entregado. ¡Gracias por tu compra!',
    cancelada:  'Tu pedido fue cancelado. Si tenes dudas, no dudes en contactarnos.'
  };

  const mensaje = mensajesPorEstado[orden.estado] || 'El estado de tu pedido fue actualizado.';
  const entregaLabel = orden.tipoEntrega === 'envio' ? 'Envio a domicilio' : 'Retiro en local';
  const ordenId = orden._id.toString().slice(-6).toUpperCase();

  await transporter.sendMail({
    from: `"Libreria" <${process.env.GMAIL_USER}>`,
    to: emailDestino,
    subject: `Actualizacion de tu pedido #${ordenId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
        <div style="background:#3b5249;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Actualizacion de pedido</h1>
        </div>
        <div style="padding:28px 32px;">
          <p style="margin-top:0;">Hay novedades sobre tu pedido <strong>#${ordenId}</strong>.</p>

          <div style="background:#f7f7f7;border-left:4px solid #3b5249;padding:16px 20px;border-radius:4px;margin:20px 0;">
            <p style="margin:0;font-size:15px;"><strong>Estado actual:</strong> ${orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</p>
            <p style="margin:8px 0 0;font-size:14px;color:#555;">${mensaje}</p>
          </div>

          <p style="font-size:14px;"><strong>Tipo de entrega:</strong> ${entregaLabel}</p>

          <p style="margin-top:28px;font-size:13px;color:#888;">
            Si tenes alguna duda podes contactarnos respondiendo este email.
          </p>
        </div>
        <div style="background:#f7f7f7;padding:16px 32px;font-size:12px;color:#aaa;text-align:center;">
          Libreria – Programacion IV TUP UTN FRCU 2026
        </div>
      </div>
    `
  });
};

module.exports = {
  transporter,
  enviarConfirmacionPedido,
  enviarActualizacionEstado
};
