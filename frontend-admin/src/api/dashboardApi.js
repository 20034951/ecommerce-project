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
    const [ordersStats, usersCount, productsCount, categoriesCount] = await Promise.all([
      httpClient.get('/api/orders/admin/stats'),
      httpClient.get('/api/users'),
      httpClient.get('/api/products'),
      httpClient.get('/api/categories')
    ]);

    return {
      orders: ordersStats.data || [],
      totalUsers: Array.isArray(usersCount) ? usersCount.length : 0,
      totalProducts: productsCount.pagination?.total || 0,
      totalCategories: Array.isArray(categoriesCount) ? categoriesCount.length : 0
    };
  },

  /**
   * Obtiene productos con stock bajo
   * @param {number} threshold - Umbral de stock
   * @returns {Promise<Array>} - Productos con stock bajo
   */
  getLowStockProducts: async (threshold = 10) => {
    try {
      // Obtener todos los productos y filtrar localmente
      const response = await httpClient.get('/api/products?limit=100');
      const products = response.data || [];
      return products.filter(p => p.stock_quantity <= threshold);
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
      const response = await httpClient.get(`/api/orders/admin?limit=${limit}&page=1`);
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener pedidos recientes:', error);
      return [];
    }
  }
};

export default dashboardApi;
