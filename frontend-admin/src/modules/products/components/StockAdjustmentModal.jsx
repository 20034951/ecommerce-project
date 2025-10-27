import React, { useState } from "react";
import { X, Package, Plus, Minus, AlertCircle } from "lucide-react";
import { adjustStock, restockProduct } from "../api/stockApi";

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}) {
  const [adjustmentType, setAdjustmentType] = useState("restock"); // 'restock' o 'adjust'
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!quantity || parseInt(quantity) === 0) {
      setError("La cantidad debe ser diferente de 0");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        productId: product.product_id,
        quantity: parseInt(quantity),
        notes: notes.trim() || undefined,
      };

      if (adjustmentType === "restock") {
        await restockProduct(data);
      } else {
        await adjustStock(data);
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al ajustar el stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity("");
    setNotes("");
    setError(null);
    setAdjustmentType("restock");
    onClose();
  };

  const getNewStock = () => {
    const currentStock = product?.stock || 0;
    const qty = parseInt(quantity) || 0;
    return currentStock + qty;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ajustar Stock
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {product?.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Stock actual */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Stock Actual
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {product?.stock || 0}
              </p>
            </div>

            {/* Tipo de ajuste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Operación
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("restock")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    adjustmentType === "restock"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Reabastecer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("adjust")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    adjustmentType === "adjust"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Minus className="h-5 w-5" />
                  <span className="font-medium">Ajuste Manual</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {adjustmentType === "restock"
                  ? "Solo cantidades positivas. Para agregar stock al inventario."
                  : "Cantidades positivas o negativas. Para ajustes manuales."}
              </p>
            </div>

            {/* Cantidad */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Cantidad{" "}
                {adjustmentType === "adjust" &&
                  "(+ para agregar, - para quitar)"}
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder={adjustmentType === "restock" ? "10" : "+10 o -5"}
                min={adjustmentType === "restock" ? "1" : undefined}
                required
              />
              {quantity && (
                <div className="mt-2 flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nuevo stock será:
                  </span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {getNewStock()}
                  </span>
                </div>
              )}
            </div>

            {/* Notas */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Notas (Opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                placeholder="Ej: Inventario físico, producto dañado, etc."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Guardando..." : "Guardar Ajuste"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
