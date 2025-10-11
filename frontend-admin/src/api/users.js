import httpClient from './http.js';

/**
 * API para manejo de usuarios en el frontend admin
 */

export const usersApi = {
  /**
   * Obtiene todos los usuarios con paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} - Lista de usuarios paginada
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/users?${queryString}` : '/api/users';
    return httpClient.get(url);
  },

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} - Datos del usuario
   */
  getById: async (id) => {
    return httpClient.get(`/api/users/${id}`);
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  create: async (userData) => {
    return httpClient.post('/api/users', userData);
  },

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  update: async (id, userData) => {
    return httpClient.put(`/api/users/${id}`, userData);
  },

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  delete: async (id) => {
    return httpClient.delete(`/api/users/${id}`);
  },

  /**
   * Activa o desactiva un usuario
   * @param {number} id - ID del usuario
   * @param {boolean} isActive - Estado activo
   * @returns {Promise<Object>} - Usuario actualizado
   */
  toggleStatus: async (id, isActive) => {
    return httpClient.patch(`/api/users/${id}/status`, { isActive });
  },

  /**
   * Asigna roles a un usuario
   * @param {number} userId - ID del usuario
   * @param {Array} roleIds - IDs de los roles
   * @returns {Promise<Object>} - Resultado de la operación
   */
  assignRoles: async (userId, roleIds) => {
    return httpClient.post(`/api/users/${userId}/roles`, { roleIds });
  },

  /**
   * Obtiene los roles de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} - Roles del usuario
   */
  getRoles: async (userId) => {
    return httpClient.get(`/api/users/${userId}/roles`);
  },

  /**
   * Restablece la contraseña de un usuario
   * @param {number} id - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} - Resultado de la operación
   */
  resetPassword: async (id, newPassword) => {
    return httpClient.post(`/api/users/${id}/reset-password`, { password: newPassword });
  }
};

export default usersApi;