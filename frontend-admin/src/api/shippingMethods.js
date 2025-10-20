import httpClient from './http.js';

/**
 * API para manejo de métodos de envío (Admin)
 */
export const shippingMethodsApi = {
  /**
   * Obtiene todos los métodos de envío
   * @returns {Promise<Array>} - Lista de métodos de envío
   */
  getAll: async () => {
    return httpClient.get('/api/shipping-methods/admin');
  },

  /**
   * Obtiene un método de envío por ID
   * @param {number} id - ID del método de envío
   * @returns {Promise<Object>} - Datos del método de envío
   */
  getById: async (id) => {
    return httpClient.get(`/api/shipping-methods/admin/${id}`);
  },

  /**
   * Crea un nuevo método de envío
   * @param {Object} data - Datos del método de envío
   * @returns {Promise<Object>} - Método de envío creado
   */
  create: async (data) => {
    return httpClient.post('/api/shipping-methods/admin', data);
  },

  /**
   * Actualiza un método de envío existente
   * @param {number} id - ID del método de envío
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} - Método de envío actualizado
   */
  update: async (id, data) => {
    return httpClient.put(`/api/shipping-methods/admin/${id}`, data);
  },

  /**
   * Elimina un método de envío
   * @param {number} id - ID del método de envío
   * @returns {Promise<Object>} - Resultado de la operación
   */
  delete: async (id) => {
    return httpClient.delete(`/api/shipping-methods/admin/${id}`);
  }
};

export default shippingMethodsApi;
