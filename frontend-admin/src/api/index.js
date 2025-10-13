/**
 * Punto de entrada para todas las APIs del frontend admin
 * Exporta todas las APIs de manera organizada
 */

// Cliente HTTP base
export { default as httpClient, HttpError } from './http.js';

// APIs específicas
export { default as authApi } from './auth.js';
export { default as usersApi } from './users.js';
export { default as productsApi } from './products.js';
export { default as categoriesApi } from './categories.js';
export { default as rolesApi } from './roles.js';

// TODO: Agregar más APIs cuando se implementen
// export { default as ordersApi } from './orders.js';
// export { default as dashboardApi } from './dashboard.js';
// export { default as settingsApi } from './settings.js';