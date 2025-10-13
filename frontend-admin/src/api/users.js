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
   * Actualiza el rol de un usuario
   * @param {number} id - ID del usuario
   * @param {string} role - Nuevo rol (customer, admin, editor)
   * @returns {Promise<Object>} - Usuario actualizado
   */
  updateRole: async (id, role) => {
    return httpClient.put(`/api/users/${id}/role`, { role });
  },

  /**
   * Obtiene las sesiones activas de un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<Array>} - Sesiones activas del usuario
   */
  getSessions: async (id) => {
    return httpClient.get(`/api/users/${id}/sessions`);
  },

  /**
   * Restablece la contraseña de un usuario
   * @param {number} id - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} - Resultado de la operación
   */
  resetPassword: async (id, newPassword) => {
    return httpClient.post(`/api/users/${id}/reset-password`, { password: newPassword });
  },

  /**
   * Termina una sesión específica de un usuario
   * @param {number} userId - ID del usuario
   * @param {number} sessionId - ID de la sesión
   * @returns {Promise<Object>} - Resultado de la operación
   */
  terminateSession: async (userId, sessionId) => {
    return httpClient.delete(`/api/users/${userId}/sessions/${sessionId}`);
  },

  /**
   * Termina todas las sesiones de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  terminateAllSessions: async (userId) => {
    return httpClient.delete(`/api/users/${userId}/sessions`);
  },

  /**
   * Solicita recuperación de contraseña para un usuario
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  requestPasswordReset: async (email) => {
    return httpClient.post('/api/auth/forgot-password', { email });
  }
};

export default usersApi;  