import React, { useState } from "react";
import { Ticket, X, CheckCircle, AlertCircle } from "lucide-react";
import couponsApi from "../../../api/coupons";

export default function CouponInput({
  orderTotal,
  onCouponApplied,
  onCouponRemoved,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setValidating(true);
    setError("");

    try {
      const response = await couponsApi.validate(
        couponCode.trim().toUpperCase(),
        orderTotal
      );

      if (response.success && response.data.valid) {
        setAppliedCoupon({
          code: response.data.coupon.code,
          discount: response.data.coupon.discount,
          type: response.data.coupon.type,
          discountAmount: response.data.discountAmount,
          finalTotal: response.data.finalTotal,
          coupon_id: response.data.coupon.coupon_id,
        });

        // Notify parent component
        if (onCouponApplied) {
          onCouponApplied({
            code: response.data.coupon.code,
            coupon_id: response.data.coupon.coupon_id,
            discountAmount: response.data.discountAmount,
            finalTotal: response.data.finalTotal,
          });
        }

        setCouponCode("");
      }
    } catch (err) {
      setError(err.message || "Invalid coupon code");
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setError("");
    setCouponCode("");

    if (onCouponRemoved) {
      onCouponRemoved();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (appliedCoupon) {
    return (
      <div
        className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700
  rounded-lg p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Coupon Applied: {appliedCoupon.code}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {appliedCoupon.type === "percent"
                  ? `${appliedCoupon.discount}% discount`
                  : `${formatCurrency(appliedCoupon.discount)} discount`}
              </p>
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mt-1">
                You save: {formatCurrency(appliedCoupon.discountAmount)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded transition"
            title="Remove coupon"
          >
            <X className="w-4 h-4 text-green-700 dark:text-green-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Ticket className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Have a coupon code?
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCoupon(e);
              }
            }}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   placeholder-gray-400 dark:placeholder-gray-500"
            disabled={validating}
            maxLength={50}
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={validating || !couponCode.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                                   transition-colors"
          >
            {validating ? "Validating..." : "Apply"}
          </button>
        </div>

        {error && (
          <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
