// src/api/cart.js
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5005';

async function http(path, { method = 'GET', body } = {}) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // 👈 importante: manda cookie cart_id
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
    }
    return res.json();
}

export const getCart = () => http('/api/cart');
export const addToCart = (payload) => http('/api/cart/items', { method: 'POST', body: payload });
export const updateItem = (payload) => http('/api/cart/items', { method: 'PUT', body: payload });
export const removeItem = (productId) => http(`/api/cart/items/${productId}`, { method: 'DELETE' });
