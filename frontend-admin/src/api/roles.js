import httpClient from './http.js';

/**
 * API para manejo de roles en el frontend admin
 */

export const rolesApi = {
  /**
   * Obtiene todos los roles
   * @returns {Promise<Array>} - Lista de roles
   */
  getAll: async () => {
    return httpClient.get('/api/roles');
  },

  /**
   * Obtiene un rol por ID
   * @param {number} id - ID del rol
   * @returns {Promise<Object>} - Datos del rol
   */
  getById: async (id) => {
    return httpClient.get(`/api/roles/${id}`);
  },

  /**
   * Crea un nuevo rol
   * @param {Object} roleData - Datos del rol
   * @returns {Promise<Object>} - Rol creado
   */
  create: async (roleData) => {
    return httpClient.post('/api/roles', roleData);
  },

  /**
   * Actualiza un rol existente
   * @param {number} id - ID del rol
   * @param {Object} roleData - Datos a actualizar
   * @returns {Promise<Object>} - Rol actualizado
   */
  update: async (id, roleData) => {
    return httpClient.put(`/api/roles/${id}`, roleData);
  },

  /**
   * Elimina un rol
   * @param {number} id - ID del rol
   * @returns {Promise<Object>} - Resultado de la operación
   */
  delete: async (id) => {
    return httpClient.delete(`/api/roles/${id}`);
  },

  /**
   * Obtiene usuarios con un rol específico
   * @param {number} roleId - ID del rol
   * @returns {Promise<Array>} - Usuarios con el rol
   */
  getUsersByRole: async (roleId) => {
    return httpClient.get(`/api/roles/${roleId}/users`);
  }
};

export default rolesApi;