import httpClient from '../../../api/http.js';

/**
 * Obtener todas las categorías con conteo de productos
 */
export const getAllCategories = async (params = {}) => {
    const response = await httpClient.get('/api/categories', { params });
    return response;
};

/**
 * Obtener categoría por ID
 */
export const getCategoryById = async (id) => {
    const response = await httpClient.get(`/api/categories/${id}`);
    return response;
};

/**
 * Crear nueva categoría
 */
export const createCategory = async (data) => {
    const response = await httpClient.post('/api/categories', data);
    return response;
};

/**
 * Actualizar categoría
 */
export const updateCategory = async (id, data) => {
    const response = await httpClient.put(`/api/categories/${id}`, data);
    return response;
};

/**
 * Eliminar categoría
 */
export const deleteCategory = async (id) => {
    const response = await httpClient.delete(`/api/categories/${id}`);
    return response;
};

/**
 * Obtener estadísticas de productos por categoría
 */
export const getCategoryStats = async () => {
    const response = await httpClient.get('/api/categories');
    // El backend ya devuelve productCount en cada categoría
    return response;
};
