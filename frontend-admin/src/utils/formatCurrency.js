/**
 * Formatea un número como moneda en Quetzales
 * @param {number} amount - El monto a formatear
 * @returns {string} - Monto formateado como "Q. 999,999.99"
 */
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return 'Q. 0.00';
    }

    // Convertir a número y asegurar 2 decimales
    const numericAmount = parseFloat(amount);

    // Formatear con separadores de miles y 2 decimales
    const formatted = numericAmount.toLocaleString('es-GT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `Q. ${formatted}`;
};

/**
 * Formatea un número sin símbolo de moneda
 * @param {number} amount - El monto a formatear
 * @returns {string} - Monto formateado como "999,999.99"
 */
export const formatNumber = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00';
    }

    const numericAmount = parseFloat(amount);

    return numericAmount.toLocaleString('es-GT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

/**
 * Formatea un número entero sin decimales
 * @param {number} amount - El número a formatear
 * @returns {string} - Número formateado como "999,999"
 */
export const formatInteger = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0';
    }

    const numericAmount = parseInt(amount);

    return numericAmount.toLocaleString('es-GT');
};

export default formatCurrency;
