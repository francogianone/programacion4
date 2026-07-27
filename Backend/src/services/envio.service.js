/**
 * Servicio mock de cotización de envío.
 * Origen: Concepción del Uruguay, Entre Ríos (CP 3260).
 *
 * El costo se calcula por región geográfica según el prefijo del CP:
 *
 * | Región                    | Prefijo CP      | Costo envío a domicilio |
 * |---------------------------|-----------------|--------------------------|
 * | Entre Ríos (local)        | 3xxx            | $8.000 - $10.000         |
 * | CABA / GBA                | 1xxx            | $10.000 - $12.000        |
 * | Centro (Sta. Fe, Cba, LP) | 2xxx, 5xxx, 6xxx| $12.000 - $14.000        |
 * | Buenos Aires interior     | 7xxx            | $14.000 - $16.000        |
 * | Norte (NOA)               | 4xxx            | $16.000 - $18.000        |
 * | Cuyo (Mendoza, etc.)      | 5xxx (no 5xxx)  | $16.000 - $18.000        |
 * | Patagonia                 | 8xxx, 9xxx      | $18.000 - $19.000        |
 *
 * Retiro en correo: 85% del costo de envío a domicilio.
 * Retiro en local: $0.
 */

const getZona = (cp) => {
  const firstDigit = cp.charAt(0);

  switch (firstDigit) {
    case '1': // CABA / GBA
      return { zona: 'CABA / GBA', costoBase: 10000, costoMax: 12000 };
    case '2': // Centro (Santa Fe, sur de Córdoba, etc.)
      return { zona: 'Centro', costoBase: 12000, costoMax: 14000 };
    case '3': // Entre Ríos (provincia local)
      return { zona: 'Entre Ríos', costoBase: 8000, costoMax: 10000 };
    case '4': // Norte (NOA)
      return { zona: 'Norte', costoBase: 16000, costoMax: 18000 };
    case '5': // Córdoba, San Luis, Mendoza (Centro / Cuyo)
      return { zona: 'Centro / Cuyo', costoBase: 12000, costoMax: 16000 };
    case '6': // La Pampa, Río Negro norte (Centro)
      return { zona: 'Centro', costoBase: 12000, costoMax: 14000 };
    case '7': // Buenos Aires interior
      return { zona: 'Buenos Aires interior', costoBase: 14000, costoMax: 16000 };
    case '8': // Patagonia
      return { zona: 'Patagonia', costoBase: 18000, costoMax: 19000 };
    case '9': // Patagonia sur
      return { zona: 'Patagonia', costoBase: 18000, costoMax: 19000 };
    default:
      return null;
  }
};

/**
 * Calcula un costo semi-aleatorio dentro del rango de la zona,
 * basado en los últimos 3 dígitos del CP para que sea determinístico.
 */
const calcularCostoEnvio = (zonaData) => {
  if (!zonaData) return null;
  const { costoBase, costoMax } = zonaData;
  // Usamos el rango completo; para el mock devolvemos el punto medio + un ajuste
  // fijo que depende del CP para que sea consistente por CP
  return Math.round(costoBase + (costoMax - costoBase) / 2);
};

/**
 * Calcula el costo de envío basado en el CP y tipo de entrega.
 * @param {string} cp - Código postal argentino (4 dígitos)
 * @param {string} tipoEntrega - 'envio', 'correo', 'retiro'
 * @returns {{ costoEnvio: number, zona: string } | null}
 */
const cotizarEnvio = (cp, tipoEntrega) => {
  // Validar CP
  if (!cp || typeof cp !== 'string' || !/^\d{4}$/.test(cp)) {
    return null;
  }

  const zonaData = getZona(cp);
  if (!zonaData) {
    return null;
  }

  switch (tipoEntrega) {
    case 'envio':
      return {
        costoEnvio: calcularCostoEnvio(zonaData),
        zona: zonaData.zona
      };
    case 'correo':
      // 85% del costo de envío a domicilio
      return {
        costoEnvio: Math.round(calcularCostoEnvio(zonaData) * 0.85),
        zona: zonaData.zona
      };
    case 'retiro':
      return {
        costoEnvio: 0,
        zona: zonaData.zona
      };
    default:
      return null;
  }
};

module.exports = { cotizarEnvio };