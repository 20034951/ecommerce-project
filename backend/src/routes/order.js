import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { updateOrderStatus } from "../services/orderService.js";
// import db from "../config/db.js";
import db from "../models/index.js";

const router = express.Router();

/**
 * @route POST /api/orders
 * @desc Create new order
 */
router.post(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id, address_id, shipping_method_id, coupon_id, items } =
      req.body;

    if (
      !user_id ||
      !address_id ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Datos de orden incompletos" });
    }

    // Calcular total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Crear orden
    const order = await db.Order.create({
      user_id,
      address_id,
      shipping_method_id,
      coupon_id,
      total_amount: totalAmount,
      status: "pending",
    });

    // Insertar items
    for (const item of items) {
      await db.OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order_id: order.order_id,
      total_amount: totalAmount,
      status: "pending",
    });
  })
);

/**
 * @route PUT /api/orders/:id/status
 * @desc Update order status and send notification email
 */
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json({ message: "Order status updated", order });
  })
);

export default router;
