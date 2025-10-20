import db from "../models/index.js";
import HttpError from "../utils/HttpError.js";
import emailService from "./emailService.js";
import { Op } from "sequelize";

const {
  Order,
  OrderItem,
  OrderStatusHistory,
  User,
  UserAddress,
  ShippingMethod,
  Coupon,
  Product,
} = db;

class OrderService {
  /**
   * Crear un nuevo pedido
   */
  async createOrder(orderData, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const { addressId, items, shippingMethodId, couponId, totalAmount } =
        orderData;

      // Verificar que la dirección pertenezca al usuario
      const address = await UserAddress.findOne({
        where: { address_id: addressId, user_id: userId },
      });

      if (!address) {
        throw new HttpError(
          404,
          "Dirección no encontrada o no pertenece al usuario"
        );
      }

      // Crear la orden
      const order = await Order.create(
        {
          user_id: userId,
          address_id: addressId,
          shipping_method_id: shippingMethodId,
          coupon_id: couponId,
          total_amount: totalAmount,
          status: "pending",
        },
        { transaction }
      );

      // Crear los items de la orden
      const orderItems = items.map((item) => ({
        order_id: order.order_id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await OrderItem.bulkCreate(orderItems, { transaction });

      // Crear el primer registro en el historial
      await OrderStatusHistory.create(
        {
          order_id: order.order_id,
          status: "pending",
          notes: "Pedido creado",
          changed_by: userId,
        },
        { transaction }
      );

      await transaction.commit();

      // Retornar orden con sus relaciones
      const orderWithDetails = await this.getOrderById(order.order_id, userId);

      // Enviar email de confirmación (sin bloquear)
      emailService
        .sendOrderConfirmation(orderWithDetails)
        .catch((err) =>
          console.error("Error enviando email de confirmación:", err)
        );

      return orderWithDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener un pedido por ID
   */
  async getOrderById(orderId, userId = null, isAdmin = false) {
    const whereClause = { order_id: orderId };

    // Si no es admin, solo puede ver sus propios pedidos
    if (!isAdmin && userId) {
      whereClause.user_id = userId;
    }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email", "phone"],
        },
        {
          model: UserAddress,
          as: "address",
        },
        {
          model: ShippingMethod,
          as: "shippingMethod",
        },
        {
          model: Coupon,
          as: "coupon",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name", "sku", "price"],
            },
          ],
        },
        {
          model: OrderStatusHistory,
          as: "statusHistory",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["user_id", "name", "email"],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!order) {
      throw new HttpError(404, "Pedido no encontrado");
    }

    return order;
  }

  /**
   * Obtener pedidos de un usuario
   */
  async getUserOrders(userId, filters = {}) {
    const { status, page = 1, limit = 10, search } = filters;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };

    // Filtro por estado
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // Búsqueda por número de tracking
    if (search) {
      whereClause.tracking_number = { [Op.like]: `%${search}%` };
    }

    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name", "sku"],
            },
          ],
        },
        {
          model: ShippingMethod,
          as: "shippingMethod",
        },
      ],
      distinct: true, // Contar solo órdenes únicas, no los items relacionados
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Obtener todos los pedidos (Admin)
   */
  async getAllOrders(filters = {}) {
    const {
      status,
      page = 1,
      limit = 10,
      search,
      userId,
      startDate,
      endDate,
    } = filters;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Filtro por estado (validar que no sea vacío)
    if (status && status !== "all" && status.trim() !== "") {
      whereClause.status = status;
    }

    // Filtro por usuario
    if (userId) {
      whereClause.user_id = userId;
    }

    // Búsqueda por número de tracking o ID (validar que no sea vacío)
    if (search && search.trim() !== "") {
      whereClause[Op.or] = [
        { tracking_number: { [Op.like]: `%${search}%` } },
        { order_id: isNaN(search) ? 0 : parseInt(search) },
      ];
    }

    // Filtro por rango de fechas (validar que sean fechas válidas)
    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate && startDate.trim() !== "") {
        whereClause.created_at[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate.trim() !== "") {
        whereClause.created_at[Op.lte] = new Date(endDate);
      }
    }

    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email", "phone"],
        },
        {
          model: UserAddress,
          as: "address",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name", "sku"],
            },
          ],
        },
      ],
      distinct: true, // Contar solo órdenes únicas, no los items relacionados
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Actualizar el estado de un pedido
   */
  async updateOrderStatus(orderId, statusData, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const { status, notes, trackingNumber, trackingUrl, estimatedDelivery } =
        statusData;

      const order = await Order.findByPk(orderId, { transaction });

      if (!order) {
        throw new HttpError(404, "Pedido no encontrado");
      }

      // Validar transición de estado
      this._validateStatusTransition(order.status, status);

      const updateData = { status };

      // Actualizar campos según el nuevo estado
      if (status === "shipped") {
        updateData.shipped_at = new Date();
        if (trackingNumber) updateData.tracking_number = trackingNumber;
        if (trackingUrl) updateData.tracking_url = trackingUrl;
        if (estimatedDelivery)
          updateData.estimated_delivery = estimatedDelivery;
      } else if (status === "delivered") {
        updateData.delivered_at = new Date();
      } else if (status === "cancelled") {
        updateData.cancelled_at = new Date();
        if (notes) updateData.cancellation_reason = notes;
      }

      await order.update(updateData, { transaction });

      // Crear registro en el historial
      await OrderStatusHistory.create(
        {
          order_id: orderId,
          status,
          notes: notes || `Estado cambiado a ${status}`,
          changed_by: userId,
        },
        { transaction }
      );

      await transaction.commit();

      const updatedOrder = await this.getOrderById(orderId, null, true);

      // Enviar email según el nuevo estado (sin bloquear)
      if (status === "shipped") {
        emailService
          .sendOrderShipped(updatedOrder)
          .catch((err) => console.error("Error enviando email de envío:", err));
      } else if (status === "delivered") {
        emailService
          .sendOrderDelivered(updatedOrder)
          .catch((err) =>
            console.error("Error enviando email de entrega:", err)
          );
      }

      return updatedOrder;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Cancelar un pedido
   */
  async cancelOrder(orderId, userId, reason, isAdmin = false) {
    const transaction = await db.sequelize.transaction();

    try {
      const whereClause = { order_id: orderId };

      // Si no es admin, solo puede cancelar sus propios pedidos
      if (!isAdmin) {
        whereClause.user_id = userId;
      }

      const order = await Order.findOne({ where: whereClause, transaction });

      if (!order) {
        throw new HttpError(404, "Pedido no encontrado");
      }

      // Validar que el pedido pueda ser cancelado
      if (!["pending", "paid", "processing"].includes(order.status)) {
        throw new HttpError(
          400,
          "El pedido no puede ser cancelado en su estado actual"
        );
      }

      await order.update(
        {
          status: "cancelled",
          cancelled_at: new Date(),
          cancellation_reason: reason,
        },
        { transaction }
      );

      // Crear registro en el historial
      await OrderStatusHistory.create(
        {
          order_id: orderId,
          status: "cancelled",
          notes: `Pedido cancelado. Razón: ${reason}`,
          changed_by: userId,
        },
        { transaction }
      );

      await transaction.commit();

      const cancelledOrder = await this.getOrderById(orderId, userId, isAdmin);

      // Enviar email de cancelación (sin bloquear)
      emailService
        .sendOrderCancelled(cancelledOrder)
        .catch((err) =>
          console.error("Error enviando email de cancelación:", err)
        );

      return cancelledOrder;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtener historial de cambios de un pedido
   */
  async getOrderHistory(orderId, userId = null, isAdmin = false) {
    // Verificar que el pedido existe y el usuario tiene acceso
    await this.getOrderById(orderId, userId, isAdmin);

    const history = await OrderStatusHistory.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return history;
  }

  /**
   * Obtener estadísticas de pedidos (Admin)
   */
  async getOrderStats() {
    const stats = await Order.findAll({
      attributes: [
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("order_id")), "count"],
        [db.sequelize.fn("SUM", db.sequelize.col("total_amount")), "total"],
      ],
      group: ["status"],
    });

    return stats;
  }

  /**
   * Exportar pedidos a formato CSV
   */
  async exportOrdersToCSV(filters = {}) {
    const { status, search, userId, startDate, endDate } = filters;
    const whereClause = {};

    // Filtro por estado
    if (status && status !== "all" && status.trim() !== "") {
      whereClause.status = status;
    }

    // Filtro por usuario
    if (userId) {
      whereClause.user_id = userId;
    }

    // Búsqueda por número de tracking o ID
    if (search && search.trim() !== "") {
      whereClause[Op.or] = [
        { tracking_number: { [Op.like]: `%${search}%` } },
        { order_id: isNaN(search) ? 0 : parseInt(search) },
      ];
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate && startDate.trim() !== "") {
        whereClause.created_at[Op.gte] = new Date(startDate);
      }
      if (endDate && endDate.trim() !== "") {
        whereClause.created_at[Op.lte] = new Date(endDate);
      }
    }

    // Obtener todos los pedidos sin paginación
    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email", "phone"],
        },
        {
          model: UserAddress,
          as: "address",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name", "sku"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Generar CSV
    const headers = [
      "ID Pedido",
      "Cliente",
      "Email",
      "Teléfono",
      "Estado",
      "Total",
      "Items",
      "Tracking",
      "Fecha Pedido",
      "Dirección",
    ];

    const rows = orders.map((order) => {
      const itemsCount = order.items?.length || 0;
      const itemsList =
        order.items
          ?.map((item) => `${item.product?.name || "N/A"} (x${item.quantity})`)
          .join("; ") || "N/A";

      return [
        order.order_id,
        order.user?.name || "N/A",
        order.user?.email || "N/A",
        order.user?.phone || "N/A",
        order.status,
        order.total_amount,
        `${itemsCount} items: ${itemsList}`,
        order.tracking_number || "N/A",
        order.created_at.toISOString().split("T")[0],
        order.address
          ? `${order.address.address_line1}, ${order.address.city}`
          : "N/A",
      ];
    });

    // Construir CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  }

  /**
   * Validar transición de estados
   */
  _validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      pending: ["paid", "cancelled"],
      paid: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new HttpError(
        `No se puede cambiar el estado de '${currentStatus}' a '${newStatus}'`,
        400
      );
    }
  }
}

export default new OrderService();
