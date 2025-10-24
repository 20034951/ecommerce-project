import express from "express";
import couponService from "../services/couponService.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import HttpError from "../utils/HttpError.js";

const router = express.Router();

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/coupons/admin/stats
 * @desc    Get coupon statistics
 * @access  Private/Admin
 */
router.get(
  "/admin/stats",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const stats = await couponService.getCouponStats();

    res.json({
      success: true,
      data: stats,
    });
  })
);

/**
 * @route   GET /api/coupons/admin
 * @desc    Get all coupons (paginated)
 * @access  Private/Admin
 */
router.get(
  "/admin",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const result = await couponService.getAllCoupons(req.query);

    res.json({
      success: true,
      data: result.coupons,
      pagination: result.pagination,
    });
  })
);

/**
 * @route   GET /api/coupons/admin/:id
 * @desc    Get coupon by ID with usage details
 * @access  Private/Admin
 */
router.get(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const coupon = await couponService.getCouponById(req.params.id);

    res.json({
      success: true,
      data: coupon,
    });
  })
);

/**
 * @route   POST /api/coupons/admin
 * @desc    Create a new coupon
 * @access  Private/Admin
 */
router.post(
  "/admin",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const coupon = await couponService.createCoupon(req.body);

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  })
);

/**
 * @route   PUT /api/coupons/admin/:id
 * @desc    Update a coupon
 * @access  Private/Admin
 */
router.put(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);

    res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  })
);

/**
 * @route   DELETE /api/coupons/admin/:id
 * @desc    Delete a coupon
 * @access  Private/Admin
 */
router.delete(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const result = await couponService.deleteCoupon(req.params.id);

    res.json({
      success: true,
      message: result.message,
    });
  })
);

// ============================================
// PUBLIC/USER ROUTES
// ============================================

/**
 * @route   POST /api/coupons/validate
 * @desc    Validate a coupon code
 * @access  Public (can be used during checkout)
 */
router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const { code, orderTotal } = req.body;

    if (!code) {
      throw new HttpError(400, "Coupon code is required");
    }

    if (!orderTotal || orderTotal <= 0) {
      throw new HttpError(400, "Valid order total is required");
    }

    const result = await couponService.validateCoupon(code, orderTotal);

    res.json({
      success: true,
      data: {
        valid: result.valid,
        coupon: {
          coupon_id: result.coupon.coupon_id,
          code: result.coupon.code,
          discount: result.coupon.discount,
          type: result.coupon.type,
        },
        discountAmount: result.discountAmount,
        finalTotal: result.finalTotal,
      },
    });
  })
);

export default router;
