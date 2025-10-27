import httpClient from '../../../api/http.js';

/**
 * Obtener historial de movimientos de stock de un producto
 * @param {number} productId - ID del producto
 * @param {Object} params - Parámetros de paginación y filtros
 */
export const getProductStockHistory = async (productId, params = {}) => {
    const response = await httpClient.get(`/api/stock/product/${productId}/movements`, { params });
    return response;
};

/**
 * Ajustar stock manualmente (agregar o quitar)
 * @param {Object} data - { productId, quantity, notes }
 */
export const adjustStock = async (data) => {
    const response = await httpClient.post('/api/stock/adjust', data);
    return response;
};

/**
 * Reabastecer stock de un producto
 * @param {Object} data - { productId, quantity, notes }
 */
export const restockProduct = async (data) => {
    const response = await httpClient.post('/api/stock/restock', data);
    return response;
};

/**
 * Obtener estadísticas de movimientos de stock
 * @param {Object} params - Filtros opcionales
 */
export const getStockStats = async (params = {}) => {
    const response = await httpClient.get('/api/stock/stats', { params });
    return response;
};
