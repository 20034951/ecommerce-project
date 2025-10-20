// backend/src/routes/cart.routes.js
import { Router } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

// Carritos en memoria: { [cartId]: { items: [{productId, name?, price?, quantity}], updatedAt } }
const carts = new Map();

function getOrCreateCart(req, res) {
    // Leer cookie existente
    let cartId = req.cookies?.cart_id;
    if (!cartId || !carts.has(cartId)) {
        cartId = randomUUID();
        carts.set(cartId, { items: [], updatedAt: new Date().toISOString() });
        // Cookie httpOnly para que el server identifique el carrito
        res.cookie('cart_id', cartId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,         // pon true si usas https
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
            path: '/',
        });
    }
    return { cartId, cart: carts.get(cartId) };
}

function summarize(cart) {
    const totalItems = cart.items.reduce((t, i) => t + Number(i.quantity || 0), 0);
    const totalPrice = cart.items.reduce(
        (t, i) => t + Number(i.price || 0) * Number(i.quantity || 0),
        0
    );
    return {
        items: cart.items.map(i => ({
            itemId: `${i.productId}`,    // placeholder
            productId: Number(i.productId),
            name: i.name ?? null,
            price: Number(i.price ?? 0),
            quantity: Number(i.quantity ?? 0),
            image: i.image ?? null,
            subtotal: Number(i.price ?? 0) * Number(i.quantity ?? 0),
        })),
        totalItems,
        totalPrice,
        updatedAt: cart.updatedAt,
    };
}

// GET /api/cart -> devuelve el carrito (y crea cookie si no hay)
router.get('/', (req, res) => {
    const { cart } = getOrCreateCart(req, res);
    return res.json(summarize(cart));
});

// POST /api/cart/items  { productId, quantity, name?, price?, image? }
router.post('/items', (req, res) => {
    const { cartId, cart } = getOrCreateCart(req, res);
    const { productId, quantity = 1, name, price, image } = req.body || {};

    if (!productId) {
        return res.status(400).json({ message: 'productId es requerido' });
    }
    const q = Math.max(1, Number(quantity || 1));

    const idx = cart.items.findIndex(i => Number(i.productId) === Number(productId));
    if (idx >= 0) {
        cart.items[idx].quantity = Number(cart.items[idx].quantity || 0) + q;
    } else {
        cart.items.push({
            productId: Number(productId),
            quantity: q,
            name: name ?? null,
            price: Number(price ?? 0),
            image: image ?? null,
        });
    }
    cart.updatedAt = new Date().toISOString();
    carts.set(cartId, cart);
    return res.json(summarize(cart));
});

// PUT /api/cart/items  { productId, quantity }
router.put('/items', (req, res) => {
    const { cartId, cart } = getOrCreateCart(req, res);
    const { productId, quantity } = req.body || {};
    if (!productId || typeof quantity !== 'number') {
        return res.status(400).json({ message: 'productId y quantity son requeridos' });
    }

    const idx = cart.items.findIndex(i => Number(i.productId) === Number(productId));
    if (idx < 0) return res.status(404).json({ message: 'Producto no está en el carrito' });

    if (quantity <= 0) {
        cart.items.splice(idx, 1);
    } else {
        cart.items[idx].quantity = Number(quantity);
    }
    cart.updatedAt = new Date().toISOString();
    carts.set(cartId, cart);
    return res.json(summarize(cart));
});

// DELETE /api/cart/items/:productId
router.delete('/items/:productId', (req, res) => {
    const { cartId, cart } = getOrCreateCart(req, res);
    const productId = Number(req.params.productId);

    const idx = cart.items.findIndex(i => Number(i.productId) === productId);
    if (idx < 0) return res.status(404).json({ message: 'Producto no está en el carrito' });

    cart.items.splice(idx, 1);
    cart.updatedAt = new Date().toISOString();
    carts.set(cartId, cart);
    return res.json(summarize(cart));
});

export default router;
