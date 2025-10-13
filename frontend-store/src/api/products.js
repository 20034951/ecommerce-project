import httpClient from './http.js';

/**
 * API para manejo de productos en el frontend store
 */

export const productsApi = {
  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} - Lista de productos
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    return httpClient.get(url);
  },

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} - Datos del producto
   */
  getById: async (id) => {
    return httpClient.get(`/api/products/${id}`);
  },

  /**
   * Busca productos por término de búsqueda
   * @param {string} query - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  search: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/api/products/search?${queryString}`);
  },

  /**
   * Obtiene productos por categoría
   * @param {number} categoryId - ID de la categoría
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Productos de la categoría
   */
  getByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `/api/products/category/${categoryId}?${queryString}` 
      : `/api/products/category/${categoryId}`;
    return httpClient.get(url);
  },

  /**
   * Obtiene productos relacionados
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} - Productos relacionados
   */
  getRelated: async (productId) => {
    return httpClient.get(`/api/products/${productId}/related`);
  },

  /**
   * Obtiene productos destacados
   * @param {number} limit - Número de productos a obtener
   * @returns {Promise<Object>} - Productos destacados
   */
  getFeatured: async (limit = 10) => {
    return httpClient.get(`/api/products/featured?limit=${limit}`);
  },

  /**
   * Obtiene productos más vendidos
   * @param {number} limit - Número de productos a obtener
   * @returns {Promise<Object>} - Productos más vendidos
   */
  getBestSellers: async (limit = 10) => {
    return httpClient.get(`/api/products/bestsellers?limit=${limit}`);
  }
};

export default productsApi;