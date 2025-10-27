import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { getProductStockHistory } from "../api/stockApi";
import { Badge } from "../../../components/ui/Badge";

export default function StockHistoryModal({ isOpen, onClose, product }) {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sortOrder, setSortOrder] = useState("DESC"); // DESC = más reciente primero

  useEffect(() => {
    if (isOpen && product) {
      loadStockHistory();
    }
  }, [isOpen, product, pagination.page, sortOrder]);

  const loadStockHistory = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        order: sortOrder,
      };

      const response = await getProductStockHistory(product.product_id, params);
      setMovements(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMovementTypeInfo = (type, quantity) => {
    switch (type) {
      case "sale":
        return {
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Venta",
          variant: "error",
          color: "text-red-600 dark:text-red-400",
        };
      case "cancellation":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          label: "Cancelación",
          variant: "success",
          color: "text-green-600 dark:text-green-400",
        };
      case "adjustment":
        return {
          icon:
            quantity > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            ),
          label: "Ajuste",
          variant: quantity > 0 ? "info" : "warning",
          color:
            quantity > 0
              ? "text-blue-600 dark:text-blue-400"
              : "text-orange-600 dark:text-orange-400",
        };
      case "restock":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          label: "Reabastecimiento",
          variant: "success",
          color: "text-green-600 dark:text-green-400",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Otro",
          variant: "default",
          color: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("es-GT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset a primera página
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Historial de Stock
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {product?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Info del producto */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Stock Actual
                  </span>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product?.stock || 0}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    SKU
                  </span>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {product?.sku || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                <Calendar className="h-4 w-4" />
                {sortOrder === "DESC" ? "Más reciente" : "Más antiguo"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : movements.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  No hay movimientos de stock
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Aún no se han registrado movimientos para este producto
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {movements.map((movement) => {
                  const typeInfo = getMovementTypeInfo(
                    movement.movement_type,
                    movement.quantity
                  );
                  return (
                    <div
                      key={movement.movement_id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${
                          movement.quantity > 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {typeInfo.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={typeInfo.variant}>
                                {typeInfo.label}
                              </Badge>
                              {movement.order_id && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Orden #{movement.order_id}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm font-medium ${typeInfo.color}`}
                            >
                              {movement.quantity > 0 ? "+" : ""}
                              {movement.quantity} unidades
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                              <Calendar className="h-3 w-3" />
                              {formatDate(movement.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Stock change */}
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {movement.previous_stock}
                          </span>
                          <span>→</span>
                          <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {movement.new_stock}
                          </span>
                        </div>

                        {/* Notes */}
                        {movement.notes && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <FileText className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {movement.notes}
                            </p>
                          </div>
                        )}

                        {/* User */}
                        {movement.user && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <User className="h-3 w-3" />
                            <span>
                              {movement.user.name || movement.user.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer con paginación */}
          {!isLoading && movements.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  de {pagination.total} movimientos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
