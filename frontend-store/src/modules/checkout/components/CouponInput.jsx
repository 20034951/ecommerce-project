import React, { useState } from "react";
import { Ticket, Trash2, CheckCircle, AlertCircle } from "lucide-react";
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      setError("Por favor ingresa un código de cupón");
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
      setError(err.message || "Código de cupón inválido");
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setError("");
    setCouponCode("");
    setShowConfirmModal(false);

    if (onCouponRemoved) {
      onCouponRemoved();
    }
  };

  const handleConfirmRemove = () => {
    setShowConfirmModal(true);
  };

  const handleCancelRemove = () => {
    setShowConfirmModal(false);
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
      <>
        <div className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300 break-words">
                    Cupón Aplicado:{" "}
                    <span className="font-mono">{appliedCoupon.code}</span>
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  {appliedCoupon.type === "percent"
                    ? `${appliedCoupon.discount}% de descuento`
                    : `${formatCurrency(appliedCoupon.discount)} de descuento`}
                </p>
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mt-1">
                  Ahorras: {formatCurrency(appliedCoupon.discountAmount)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirmRemove}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition flex-shrink-0 group"
              title="Eliminar cupón"
            >
              <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      ¿Eliminar cupón?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cupón:
                    </span>
                    <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">
                      {appliedCoupon.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descuento actual:
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(appliedCoupon.discountAmount)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Si eliminas este cupón, perderás el descuento aplicado y
                  tendrás que ingresarlo nuevamente si deseas usarlo.
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelRemove}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar Cupón
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Ticket className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          ¿Tienes un código de cupón?
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
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
            placeholder="Ingresa el código del cupón"
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            disabled={validating}
            maxLength={50}
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={validating || !couponCode.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm"
          >
            {validating ? "Validando..." : "Aplicar"}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm break-words">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
