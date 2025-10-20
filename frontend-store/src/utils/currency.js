/**
 * Formatea un número como moneda en Quetzales (Q)
 * @param {number} amount - El monto a formatear
 * @param {boolean} includeSymbol - Si incluir el símbolo de moneda
 * @returns {string} El monto formateado
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  const formatted = new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);

  return includeSymbol ? `Q${formatted}` : formatted;
};

/**
 * Convierte un string o número a número decimal
 * @param {string|number} value - El valor a convertir
 * @returns {number} El valor como número
 */
export const parseAmount = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }
  return 0;
};

export default {
  formatCurrency,
  parseAmount
};
