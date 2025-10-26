import http from './http';

const homeApi = {
    /**
     * Obtener todos los datos para la página de inicio
     * @returns {Promise<Object>} Datos completos del home (categorías, productos destacados, productos por categoría)
     */
    getHomeData: async () => {
        const response = await http.get('/api/home');
        return response;
    },

    /**
     * Obtener todas las categorías con conteo de productos
     * @returns {Promise<Array>} Lista de categorías
     */
    getCategories: async () => {
        const response = await http.get('/api/home/categories');
        return response;
    },

    /**
     * Obtener productos más vendidos
     * @param {number} limit - Número de productos a obtener
     * @returns {Promise<Array>} Lista de productos destacados
     */
    getFeaturedProducts: async (limit = 10) => {
        const response = await http.get('/api/home/featured-products', {
            params: { limit }
        });
        return response;
    },

    /**
     * Obtener categorías aleatorias con productos
     * @param {number} limit - Número de productos por categoría
     * @returns {Promise<Array>} Lista de categorías con sus productos
     */
    getCategoryProducts: async (limit = 10) => {
        const response = await http.get('/api/home/category-products', {
            params: { limit }
        });
        return response;
    },
};

export default homeApi;
