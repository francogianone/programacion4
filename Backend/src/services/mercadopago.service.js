const { preferenceApi } = require('../config/mercadopago');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/**
 * Crea una preferencia de pago en Mercado Pago para una orden.
 * @param {Object} orden - Documento de orden de Mongoose
 * @returns {Promise<{init_point: string, preferenceId: string}>}
 */
const crearPreferencia = async (orden) => {
  const items = orden.productos.map((item) => ({
    id: item.producto?.toString() || item._id?.toString(),
    title: item.nombre,
    unit_price: Number(item.precio),
    quantity: Number(item.cantidad),
    currency_id: 'ARS'
  }));

  if (orden.costoEnvio > 0) {
    items.push({
      id: 'envio',
      title: 'Costo de envío',
      unit_price: Number(orden.costoEnvio),
      quantity: 1,
      currency_id: 'ARS'
    });
  }

  const preferenceData = {
    items,
    external_reference: orden._id.toString(),
    notification_url: `${BACKEND_URL}/api/ordenes/webhook`,
    back_urls: {
      success: `${FRONTEND_URL}/checkout/resultado?orden_id=${orden._id.toString()}`,
      failure: `${FRONTEND_URL}/checkout/resultado?orden_id=${orden._id.toString()}`,
      pending: `${FRONTEND_URL}/checkout/resultado?orden_id=${orden._id.toString()}`
    }
  };

  console.log('[MercadoPago] Creando preferencia con datos:', JSON.stringify(preferenceData, null, 2));

  const result = await preferenceApi.create({ body: preferenceData });

  console.log('[MercadoPago] Preferencia creada exitosamente. ID:', result.id);
  console.log('[MercadoPago] init_point:', result.init_point);
  console.log('[MercadoPago] sandbox_init_point:', result.sandbox_init_point);

  return {
    init_point: result.sandbox_init_point || result.init_point,
    preferenceId: result.id
  };
};

module.exports = { crearPreferencia };
