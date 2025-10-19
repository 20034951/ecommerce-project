import { httpClient } from './http';

/**
 * API client para la gestión de pedidos en el panel de administración
 */
export const ordersApi = {
  /**
   * Obtener lista de todos los pedidos (Admin)
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise} Respuesta con lista de pedidos y paginación
   */
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Solo agregar parámetros si tienen valores válidos (no vacíos)
    if (filters.status && filters.status !== '') params.append('status', filters.status);
    if (filters.dateFrom && filters.dateFrom !== '') params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo && filters.dateTo !== '') params.append('dateTo', filters.dateTo);
    if (filters.minAmount && filters.minAmount !== '') params.append('minAmount', filters.minAmount);
    if (filters.maxAmount && filters.maxAmount !== '') params.append('maxAmount', filters.maxAmount);
    if (filters.search && filters.search !== '') params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await httpClient.get(`/api/orders/admin?${params.toString()}`);
    return response; // Retornar la respuesta completa que incluye { success, data, pagination }
  },

  /**
   * Obtener detalles de un pedido específico (Admin)
   * @param {string|number} orderId - ID del pedido
   * @returns {Promise} Respuesta con detalles del pedido
   */
  getOrderById: async (orderId) => {
    const response = await httpClient.get(`/api/orders/admin/${orderId}`);
    return response; // Retornar la respuesta completa
  },

  /**
   * Actualizar el estado de un pedido (Admin)
   * @param {string|number} orderId - ID del pedido
   * @param {Object} statusData - Datos del nuevo estado
   * @param {string} statusData.status - Nuevo estado del pedido
   * @param {string} [statusData.trackingNumber] - Número de seguimiento
   * @param {string} [statusData.trackingUrl] - URL de seguimiento
   * @param {string} [statusData.estimatedDelivery] - Fecha estimada de entrega
   * @param {string} [statusData.notes] - Notas administrativas
   * @returns {Promise} Respuesta con pedido actualizado
   */
  updateOrderStatus: async (orderId, statusData) => {
    const response = await httpClient.put(`/api/orders/admin/${orderId}/status`, statusData);
    return response; // Retornar la respuesta completa
  },

  /**
   * Actualizar información general de un pedido (Admin)
   * @param {string|number} orderId - ID del pedido
   * @param {Object} orderData - Datos a actualizar
   * @returns {Promise} Respuesta con pedido actualizado
   */
  updateOrder: async (orderId, orderData) => {
    const response = await httpClient.put(`/api/orders/admin/${orderId}`, orderData);
    return response; // Retornar la respuesta completa
  },

  /**
   * Obtener estadísticas de pedidos (Admin)
   * @param {Object} filters - Filtros para las estadísticas
   * @returns {Promise} Respuesta con estadísticas
   */
  getOrderStats: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const response = await httpClient.get(`/api/orders/admin/stats?${params.toString()}`);
    return response; // Retornar la respuesta completa
  },

  /**
   * Exportar pedidos a CSV (Admin)
   * @param {Object} filters - Filtros para la exportación
   * @returns {Promise} Respuesta con archivo CSV
   */
  exportOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== '') params.append('status', filters.status);
    if (filters.dateFrom && filters.dateFrom !== '') params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo && filters.dateTo !== '') params.append('dateTo', filters.dateTo);
    if (filters.search && filters.search !== '') params.append('search', filters.search);

    // Construir URL completa
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    const url = `${baseURL}/api/orders/admin/export?${params.toString()}`;
    
    // Obtener token de acceso
    const token = httpClient.getAccessToken();
    
    // Hacer petición directa con fetch para obtener el blob
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al exportar pedidos');
    }

    // Obtener el blob del CSV
    const blob = await response.blob();
    
    // Crear y descargar archivo
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  }
};

export default ordersApi;
