import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../../../api/coupons";
import {
  X,
  Percent,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";

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
      newErrors.code = "El código es obligatorio";
    }

    if (!formData.discount || formData.discount <= 0) {
      newErrors.discount = "El descuento debe ser mayor a 0";
    }

    if (formData.type === "percent" && formData.discount > 100) {
      newErrors.discount = "El descuento porcentual no puede exceder 100%";
    }

    if (formData.valid_from && formData.valid_until) {
      if (new Date(formData.valid_from) > new Date(formData.valid_until)) {
        newErrors.valid_until =
          "La fecha de finalización debe ser posterior a la de inicio";
      }
    }

    if (formData.usage_limit && formData.usage_limit < 0) {
      newErrors.usage_limit = "El límite de uso no puede ser negativo";
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Editar Cupón" : "Crear Nuevo Cupón"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={mutation.isPending}
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        >
          {/* Error Alert */}
          {errors.submit && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400 rounded-lg">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error al guardar</p>
                <p className="text-sm mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Code */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="h-4 w-4" />
              Código del Cupón *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white uppercase font-mono transition-colors"
              placeholder="ej: VERANO2024"
              maxLength={50}
            />
            {errors.code && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.code}
              </p>
            )}
          </div>

          {/* Type and Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {formData.type === "percent" ? (
                  <Percent className="h-4 w-4" />
                ) : (
                  <DollarSign className="h-4 w-4" />
                )}
                Tipo de Descuento *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Valor del Descuento *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder={formData.type === "percent" ? "10" : "50"}
                  step={formData.type === "percent" ? "1" : "0.01"}
                  min="0"
                  max={formData.type === "percent" ? "100" : undefined}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  {formData.type === "percent" ? "%" : "$"}
                </div>
              </div>
              {errors.discount && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.discount}
                </p>
              )}
            </div>
          </div>

          {/* Valid Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" />
                Válido Desde
              </label>
              <input
                type="date"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4" />
                Válido Hasta
              </label>
              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
              {errors.valid_until && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.valid_until}
                </p>
              )}
            </div>
          </div>

          {/* Usage Limit and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Límite de Uso
              </label>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Dejar vacío para ilimitado"
                min="0"
              />
              {errors.usage_limit && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.usage_limit}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                <Info className="h-3.5 w-3.5" />
                Dejar vacío para usos ilimitados
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4" />
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              placeholder="Descripción opcional para uso interno..."
              rows="3"
            />
          </div>

          {/* Current Usage (only show when editing) */}
          {isEditing && coupon && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800 dark:text-blue-300">
                  Uso Actual del Cupón
                </p>
                <p className="text-blue-700 dark:text-blue-400 mt-1">
                  Este cupón se ha utilizado{" "}
                  <strong>{coupon.used_count}</strong> veces
                  {coupon.usage_limit &&
                    ` de ${coupon.usage_limit} disponibles`}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              disabled={mutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? "Actualizar Cupón" : "Crear Cupón"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
