// Asegura que cada cliente tenga un cartId persistido en cookie
import { randomUUID } from 'node:crypto'

export function ensureCartId(req, res, next) {
    const cookieName = 'cartId'
    let { cartId } = req.cookies || {}
    if (!cartId) {
        cartId = randomUUID()

        res.cookie(cookieName, cartId, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días
        })
    }
    req.cartId = cartId
    next()
}
