import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { Product } = db;

const reserveStock = async (items, transaction) => {
    // items: [{ product_id, quantity }, ...]
    for (const it of items) {
        const product = await Product.findByPk(it.product_id, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!product) {
            throw new HttpError(404, `Producto no encontrado: ${it.product_id}`);
        }

        const current = Number(product.stock_quantity || 0);
        const qty = Number(it.quantity || 0);

        if (current < qty) {
            throw new HttpError(409, `Stock insuficiente para producto ${product.product_id} (${product.name})`);
        }

        product.stock_quantity = current - qty;
        await product.save({ transaction });
    }
};

const releaseStock = async (items, transaction) => {
    for (const it of items) {
        const product = await Product.findByPk(it.product_id, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!product) {
            // si el producto fue eliminado, se omite
            continue;
        }

        const current = Number(product.stock_quantity || 0);
        const qty = Number(it.quantity || 0);

        product.stock_quantity = current + qty;
        await product.save({ transaction });
    }
};

export default {
    reserveStock,
    releaseStock
};