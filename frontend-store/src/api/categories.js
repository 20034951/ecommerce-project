import httpClient from './http.js';

/**
 * API para manejo de categorías en el frontend store
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
   * Obtiene categorías principales (sin padre)
   * @returns {Promise<Array>} - Categorías principales
   */
  getMainCategories: async () => {
    return httpClient.get('/api/categories/main');
  },

  /**
   * Obtiene subcategorías de una categoría
   * @param {number} parentId - ID de la categoría padre
   * @returns {Promise<Array>} - Subcategorías
   */
  getSubcategories: async (parentId) => {
    return httpClient.get(`/api/categories/${parentId}/subcategories`);
  }
};

export default categoriesApi;