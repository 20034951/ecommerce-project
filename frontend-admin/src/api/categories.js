import httpClient from './http.js';

/**
 * API para manejo de categorías en el frontend admin
 */

export const categoriesApi = {
  /**
   * Obtiene todas las categorías
   * @returns {Promise<Array>} - Lista de categorías
   */
  getAll: async () => {
    return httpClient.get('/api/categories');
  },

  /**
   * Obtiene categorías con productos asociados
   * @returns {Promise<Array>} - Categorías con productos
   */
  getAllWithProducts: async () => {
    return httpClient.get('/api/categories/with-products');
  },

  /**
   * Obtiene una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object>} - Datos de la categoría
   */
  getById: async (id) => {
    return httpClient.get(`/api/categories/${id}`);
  },

  /**
   * Crea una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise<Object>} - Categoría creada
   */
  create: async (categoryData) => {
    return httpClient.post('/api/categories', categoryData);
  },

  /**
   * Actualiza una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos a actualizar
   * @returns {Promise<Object>} - Categoría actualizada
   */
  update: async (id, categoryData) => {
    return httpClient.put(`/api/categories/${id}`, categoryData);
  },

  /**
   * Elimina una categoría
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object>} - Resultado de la operación
   */
  delete: async (id) => {
    return httpClient.delete(`/api/categories/${id}`);
  },

  /**
   * Obtiene estadísticas de categorías
   * @returns {Promise<Object>} - Estadísticas
   */
  getStats: async () => {
    return httpClient.get('/api/categories/stats');
  }
};

export default categoriesApi;