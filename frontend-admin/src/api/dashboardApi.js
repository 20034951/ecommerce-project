import httpClient from './http.js';

/**
 * API para obtener estadísticas del dashboard
 */
export const dashboardApi = {
  /**
   * Obtiene estadísticas generales del dashboard
   * @returns {Promise<Object>} - Estadísticas generales
   */
  getStats: async () => {
    const response = await httpClient.get('/api/dashboard/stats');
    return response.data;
  },

  /**
   * Obtiene productos con stock bajo
   * @param {number} threshold - Umbral de stock
   * @returns {Promise<Array>} - Productos con stock bajo
   */
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await httpClient.get(`/api/dashboard/low-stock?threshold=${threshold}&limit=100`);
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      return [];
    }
  },

  /**
   * Obtiene pedidos recientes
   * @param {number} limit - Número de pedidos
   * @returns {Promise<Array>} - Pedidos recientes
   */
  getRecentOrders: async (limit = 5) => {
    try {
      const response = await httpClient.get(`/api/dashboard/recent-orders?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener pedidos recientes:', error);
      return [];
    }
  }
};

export default dashboardApi;
