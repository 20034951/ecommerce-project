import api from '../../../api/http';

/**
 * API para obtener reportes de ventas
 */

/**
 * Obtener resumen general de ventas
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise}
 */
export const getSalesSummary = async (params = {}) => {
    const response = await api.get('/api/reports/sales-summary', { params });
    return response.data;
};

/**
 * Obtener ventas agrupadas por categoría
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise}
 */
export const getSalesByCategory = async (params = {}) => {
    const response = await api.get('/api/reports/sales-by-category', { params });
    return response.data;
};

/**
 * Obtener top productos más vendidos
 * @param {Object} params - { startDate, endDate, category_id, limit }
 * @returns {Promise}
 */
export const getTopProducts = async (params = {}) => {
    const response = await api.get('/api/reports/top-products', { params });
    return response.data;
};

/**
 * Obtener ventas en el tiempo (para gráficas de tendencia)
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise}
 */
export const getSalesOverTime = async (params = {}) => {
    const response = await api.get('/api/reports/sales-over-time', { params });
    return response.data;
};

/**
 * Obtener comparación de ventas entre dos períodos
 * @param {Object} params - { startDate, endDate, groupBy }
 * @returns {Promise}
 */
export const getSalesComparison = async (params = {}) => {
    const response = await api.get('/api/reports/sales-comparison', { params });
    return response.data;
};

/**
 * Obtener la fecha de la primera orden en el sistema
 * @returns {Promise<string>} - Fecha en formato ISO de la primera orden
 */
export const getFirstOrderDate = async () => {
    const response = await api.get('/api/reports/first-order-date');
    return response.data;
};

/**
 * Obtener estadísticas por método de pago
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise}
 */
export const getPaymentMethodsReport = async (params = {}) => {
    const response = await api.get('/api/reports/payment-methods-summary', { params });
    return response.data;
};

/**
 * Obtener estadísticas de cupones de descuento
 * @param {Object} params - { startDate, endDate }
 * @returns {Promise}
 */
export const getCouponsReport = async (params = {}) => {
    const response = await api.get('/api/reports/coupons-summary', { params });
    return response.data;
};

export default {
    getSalesSummary,
    getSalesByCategory,
    getTopProducts,
    getSalesOverTime,
    getSalesComparison,
    getFirstOrderDate,
    getPaymentMethodsReport,
    getCouponsReport
};
