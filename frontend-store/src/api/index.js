/**
 * Punto de entrada para todas las APIs del frontend store
 * Exporta todas las APIs de manera organizada
 */

// Cliente HTTP base
export { default as httpClient, HttpError } from './http.js';

// APIs específicas
export { default as authApi } from './auth.js';
export { default as usersApi } from './users.js';
export { default as customersApi } from './customers.js';
export { default as productsApi } from './products.js';
export { default as categoriesApi } from './categories.js';

// TODO: Agregar más APIs cuando se implementen
// export { default as ordersApi } from './orders.js';
// export { default as cartApi } from './cart.js';
// export { default as addressesApi } from './addresses.js';