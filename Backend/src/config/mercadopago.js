const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken || accessToken === 'TEST-0') {
  console.warn('[MercadoPago] ⚠ No se configuró MERCADOPAGO_ACCESS_TOKEN. Los pagos con Mercado Pago no funcionarán.');
}

// Se fuerza sandbox porque el token de prueba puede tener prefijo APP_USR- (Mercado Pago los genera así)
const client = new MercadoPagoConfig({
  accessToken: accessToken || 'TEST-0',
  options: { sandbox: true }
});

const preferenceApi = new Preference(client);
const paymentApi = new Payment(client);

module.exports = { client, preferenceApi, paymentApi };