import http from './http';

export const getCart = () => http.get('/cart')
export const addToCart = ({ productId, quantity = 1 }) =>
    http.post('/cart/items', { productId, quantity })
