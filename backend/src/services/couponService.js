import db from "../models/index.js";
import HttpError from "../utils/HttpError.js";
import { Op } from "sequelize";
import Paginator from "../utils/Paginator.js";
import { sendPaginatedResponse } from "../utils/sendPaginatedResponse.js";

const { Coupon, Order } = db;

class CouponService {
  /**
   * Get all coupons with pagination and filtering
   */
  async getAllCoupons(query = {}) {
    const paginator = new Paginator(query)
      .allowSort(["code", "discount", "used_count", "status", "created_at"])
      .allowFilter(["status", "type"])
      .build();

    const where = { ...paginator.where };

    // Add search functionality
    if (query.search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await Coupon.findAndCountAll({
      where,
      limit: paginator.limit,
      offset: paginator.offset,
      order: paginator.order,
    });

    return {
      coupons: rows,
      pagination: {
        page: paginator.page,
        limit: paginator.limit,
        total: count,
        totalPages: Math.ceil(count / paginator.limit),
      },
    };
  }

  /**
   * Get a single coupon by ID
   */
  async getCouponById(couponId) {
    const coupon = await Coupon.findByPk(couponId, {
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [
            "order_id",
            "order_number",
            "total_amount",
            "status",
            "created_at",
          ],
          limit: 10,
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!coupon) {
      throw new HttpError(404, "Cupón no encontrado");
    }

    return coupon;
  }

  /**
   * Get a coupon by code
   */
  async getCouponByCode(code) {
    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new HttpError(404, "Cupón no encontrado");
    }

    return coupon;
  }

  /**
   * Create a new coupon
   */
  async createCoupon(couponData) {
    const {
      code,
      discount,
      type,
      valid_from,
      valid_until,
      usage_limit,
      status,
      description,
    } = couponData;

    // Validate required fields
    if (!code || !discount) {
      throw new HttpError(400, "El código y el descuento son obligatorios");
    }

    // Validate discount value
    if (type === "percent" && (discount < 0 || discount > 100)) {
      throw new HttpError(400, "El descuento porcentual debe estar entre 0 y 100");
    }

    if (type === "fixed" && discount < 0) {
      throw new HttpError(400, "El descuento fijo debe ser positivo");
    }

    // Check if coupon code already exists
    const existing = await Coupon.findOne({
      where: { code: code.toUpperCase() },
    });
    if (existing) {
      throw new HttpError(400, "El código de cupón ya existe");
    }

    // Validate dates
    if (
      valid_from &&
      valid_until &&
      new Date(valid_from) > new Date(valid_until)
    ) {
      throw new HttpError(
        400,
        "La fecha de inicio debe ser anterior a la fecha de finalización"
      );
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      type: type || "percent",
      valid_from,
      valid_until,
      usage_limit,
      status: status || "active",
      description,
      used_count: 0,
    });

    return coupon;
  }

  /**
   * Update a coupon
   */
  async updateCoupon(couponId, couponData) {
    const coupon = await Coupon.findByPk(couponId);

    if (!coupon) {
      throw new HttpError(404, "Cupón no encontrado");
    }

    const {
      code,
      discount,
      type,
      valid_from,
      valid_until,
      usage_limit,
      status,
      description,
    } = couponData;

    // If updating code, check for duplicates
    if (code && code.toUpperCase() !== coupon.code) {
      const existing = await Coupon.findOne({
        where: { code: code.toUpperCase() },
      });
      if (existing) {
        throw new HttpError(400, "El código de cupón ya existe");
      }
    }

    // Validate discount if provided
    if (discount !== undefined) {
      const discountType = type || coupon.type;
      if (discountType === "percent" && (discount < 0 || discount > 100)) {
        throw new HttpError(
          400,
          "El descuento porcentual debe estar entre 0 y 100"
        );
      }
      if (discountType === "fixed" && discount < 0) {
        throw new HttpError(400, "El descuento fijo debe ser positivo");
      }
    }

    // Validate dates if provided
    const newValidFrom = valid_from || coupon.valid_from;
    const newValidUntil = valid_until || coupon.valid_until;
    if (
      newValidFrom &&
      newValidUntil &&
      new Date(newValidFrom) > new Date(newValidUntil)
    ) {
      throw new HttpError(
        400,
        "La fecha de inicio debe ser anterior a la fecha de finalización"
      );
    }

    await coupon.update({
      code: code ? code.toUpperCase() : coupon.code,
      discount: discount !== undefined ? discount : coupon.discount,
      type: type || coupon.type,
      valid_from: valid_from !== undefined ? valid_from : coupon.valid_from,
      valid_until: valid_until !== undefined ? valid_until : coupon.valid_until,
      usage_limit: usage_limit !== undefined ? usage_limit : coupon.usage_limit,
      status: status || coupon.status,
      description: description !== undefined ? description : coupon.description,
    });

    return coupon;
  }

  /**
   * Delete a coupon
   */
  async deleteCoupon(couponId) {
    const coupon = await Coupon.findByPk(couponId);

    if (!coupon) {
      throw new HttpError(404, "Cupón no encontrado");
    }

    // Check if coupon has been used
    if (coupon.used_count > 0) {
      throw new HttpError(
        400,
        "No se puede eliminar un cupón que ha sido usado. Considera desactivarlo en su lugar."
      );
    }

    await coupon.destroy();
    return { message: "Cupón eliminado exitosamente" };
  }

  /**
   * Validate and apply a coupon
   */
  async validateCoupon(code, orderTotal) {
    const coupon = await this.getCouponByCode(code);

    // Check if coupon is active
    if (coupon.status !== "active") {
      throw new HttpError(400, "Este cupón no está activo");
    }

    // Check date validity
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (coupon.valid_from) {
      const validFrom = new Date(coupon.valid_from);
      if (today < validFrom) {
        throw new HttpError(400, "Este cupón aún no es válido");
      }
    }

    if (coupon.valid_until) {
      const validUntil = new Date(coupon.valid_until);
      if (today > validUntil) {
        throw new HttpError(400, "Este cupón ha expirado");
      }
    }

    // Check usage limit
    if (
      coupon.usage_limit !== null &&
      coupon.used_count >= coupon.usage_limit
    ) {
      throw new HttpError(400, "Este cupón ha alcanzado su límite de uso");
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = (orderTotal * parseFloat(coupon.discount)) / 100;
    } else {
      discountAmount = parseFloat(coupon.discount);
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      valid: true,
      coupon,
      discountAmount,
      finalTotal: orderTotal - discountAmount,
    };
  }

  /**
   * Increment coupon usage count
   */
  async incrementUsage(couponId) {
    const coupon = await Coupon.findByPk(couponId);

    if (!coupon) {
      throw new HttpError(404, "Cupón no encontrado");
    }

    await coupon.increment("used_count");

    // Auto-deactivate if usage limit reached
    if (
      coupon.usage_limit !== null &&
      coupon.used_count + 1 >= coupon.usage_limit
    ) {
      await coupon.update({ status: "inactive" });
    }

    return coupon.reload();
  }

  /**
   * Get coupon statistics
   */
  async getCouponStats() {
    const totalCoupons = await Coupon.count();
    const activeCoupons = await Coupon.count({ where: { status: "active" } });
    const inactiveCoupons = await Coupon.count({
      where: { status: "inactive" },
    });

    const totalUsage = await Coupon.sum("used_count");

    const mostUsed = await Coupon.findAll({
      where: { used_count: { [Op.gt]: 0 } },
      order: [["used_count", "DESC"]],
      limit: 5,
    });

    return {
      totalCoupons,
      activeCoupons,
      inactiveCoupons,
      totalUsage: totalUsage || 0,
      mostUsed,
    };
  }
}

export default new CouponService();
