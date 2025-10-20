// import db from "../config/db.js";
import db from "../models/index.js";

import emailService from "./emailService.js";

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await db.Order.findByPk(orderId, {
    include: [{ model: db.User, as: "user" }],
  });
  if (!order) throw new Error("Order not found");

  order.status = newStatus;
  await order.save();

  // Enviar correo al cliente
  await emailService.sendOrderStatusEmail(
    order.user.email,
    order.user.name,
    order.order_id,
    order.status,
    order.total_amount
  );

  return order;
};
