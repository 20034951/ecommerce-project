import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../../../api/coupons";

export default function CouponFormModal({ coupon, onClose, onSuccess }) {
  const isEditing = !!coupon;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percent",
    valid_from: "",
    valid_until: "",
    usage_limit: "",
    status: "active",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        discount: coupon.discount || "",
        type: coupon.type || "percent",
        valid_from: coupon.valid_from || "",
        valid_until: coupon.valid_until || "",
        usage_limit: coupon.usage_limit || "",
        status: coupon.status || "active",
        description: coupon.description || "",
      });
    }
  }, [coupon]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) {
        return couponsApi.update(coupon.coupon_id, data);
      } else {
        return couponsApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      queryClient.invalidateQueries(["coupon-stats"]);
      onSuccess();
    },
    onError: (error) => {
      setErrors({ submit: error.message || "Failed to save coupon" });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.discount || formData.discount <= 0) {
      newErrors.discount = "Discount must be greater than 0";
    }

    if (formData.type === "percent" && formData.discount > 100) {
      newErrors.discount = "Percentage discount cannot exceed 100";
    }

    if (formData.valid_from && formData.valid_until) {
      if (new Date(formData.valid_from) > new Date(formData.valid_until)) {
        newErrors.valid_until = "End date must be after start date";
      }
    }

    if (formData.usage_limit && formData.usage_limit < 0) {
      newErrors.usage_limit = "Usage limit cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      ...formData,
      discount: parseFloat(formData.discount),
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
    };

    mutation.mutate(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh]
  overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Coupon" : "Create New Coupon"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
  dark:text-white uppercase"
              placeholder="e.g., SUMMER2024"
              maxLength={50}
            />
            {errors.code && (
              <p className="text-red-600 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          {/* Type and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
                placeholder={formData.type === "percent" ? "10" : "50"}
                step={formData.type === "percent" ? "1" : "0.01"}
                min="0"
                max={formData.type === "percent" ? "100" : undefined}
              />
              {errors.discount && (
                <p className="text-red-600 text-sm mt-1">{errors.discount}</p>
              )}
            </div>
          </div>

          {/* Valid Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid From
              </label>
              <input
                type="date"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
              />
              {errors.valid_until && (
                <p
                  className="text-red-600 text-sm
  mt-1"
                >
                  {errors.valid_until}
                </p>
              )}
            </div>
          </div>

          {/* Usage Limit and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
                placeholder="Leave empty for unlimited"
                min="0"
              />
              {errors.usage_limit && (
                <p
                  className="text-red-600 text-sm
  mt-1"
                >
                  {errors.usage_limit}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty for unlimited uses
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700
  dark:border-gray-600 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
  dark:text-white"
              placeholder="Optional description for internal use"
              rows="3"
            />
          </div>

          {/* Current Usage (only show when editing) */}
          {isEditing && coupon && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Current Usage:</strong> {coupon.used_count} times
                {coupon.usage_limit && ` out of ${coupon.usage_limit}`}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
  disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Update Coupon"
                  : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
