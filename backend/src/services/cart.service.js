// src/services/cart.service.js
// Guarda el carrito en Redis por cartId y enriquece items con datos de MySQL.

// AJUSTA este import al helper de MySQL que ya tengas.
import { pool } from '../../db/index.js'
// Opción B: si tu pool está en otro sitio, cambia la ruta arriba.

// Redis client: si ya tienes uno central, impórtalo.
// Si NO, este cliente mínimo funciona con REDIS_URL=redis://redis:6379
import { createClient } from 'redis'
const redis = createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' })
redis.on('error', (e) => console.error('[redis] error', e))
await redis.connect()

const CART_PREFIX = 'cart:' // clave: cart:{cartId}

const cartKey = (cartId) => `${CART_PREFIX}${cartId}`

async function readCartRaw(cartId) {
    const raw = await redis.get(cartKey(cartId))
    return raw ? JSON.parse(raw) : { items: {} } // items: { [productId]: quantity }
}

async function writeCartRaw(cartId, cart) {
    await redis.set(cartKey(cartId), JSON.stringify(cart), { EX: 60 * 60 * 24 * 30 }) // 30 días
}

async function fetchProduct(productId) {
    // Ajusta campos/tabla si difieren
    const [rows] = await pool.query(
        'SELECT product_id AS id, name, price, image_path FROM products WHERE product_id = ? LIMIT 1',
        [productId]
    )
    return rows[0] || null
}

async function buildSummary(cart) {
    const ids = Object.keys(cart.items || {})
    const items = []
    let totalItems = 0
    let totalPrice = 0

    for (const pid of ids) {
        const quantity = Number(cart.items[pid] || 0)
        if (quantity <= 0) continue

        const p = await fetchProduct(pid)
        if (!p) continue

        const price = Number(p.price)
        const subtotal = price * quantity

        items.push({
            itemId: String(pid),
            productId: Number(pid),
            name: p.name,
            price,
            quantity,
            image: p.image_path,
            subtotal
        })

        totalItems += quantity
        totalPrice += subtotal
    }

    return {
        items,
        totalItems,
        totalPrice: Number(totalPrice.toFixed(2))
    }
}

export async function getCart({ cartId }) {
    const cart = await readCartRaw(cartId)
    return buildSummary(cart)
}

export async function addItem({ cartId, productId, quantity = 1 }) {
    if (!productId) throw new Error('productId requerido')
    const q = Math.max(1, Number(quantity) || 1)

    const cart = await readCartRaw(cartId)
    const prev = Number(cart.items[productId] || 0)
    cart.items[productId] = prev + q
    await writeCartRaw(cartId, cart)

    return buildSummary(cart)
}

export async function updateItem({ cartId, productId, quantity }) {
    if (!productId || quantity == null) throw new Error('productId y quantity requeridos')
    const q = Math.max(0, Number(quantity) || 0)

    const cart = await readCartRaw(cartId)
    if (q === 0) delete cart.items[productId]
    else cart.items[productId] = q

    await writeCartRaw(cartId, cart)
    return buildSummary(cart)
}

export async function removeItem({ cartId, productId }) {
    const cart = await readCartRaw(cartId)
    delete cart.items[productId]
    await writeCartRaw(cartId, cart)
    return buildSummary(cart)
}

export async function clearCart({ cartId }) {
    const empty = { items: {} }
    await writeCartRaw(cartId, empty)
    return { items: [], totalItems: 0, totalPrice: 0 }
}
