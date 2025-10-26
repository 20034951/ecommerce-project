import React from "react";
import {
  Edit2,
  Trash2,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CouponsTable({
  coupons = [],
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      active: {
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/20",
        icon: CheckCircle2,
        label: "Activo",
      },
      inactive: {
        bg: "bg-red-50 dark:bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-500/20",
        icon: XCircle,
        label: "Inactivo",
      },
      expired: {
        bg: "bg-gray-50 dark:bg-gray-500/10",
        text: "text-gray-700 dark:text-gray-400",
        border: "border-gray-200 dark:border-gray-500/20",
        icon: Clock,
        label: "Expirado",
      },
    };

    const statusConfig = config[status] || config.inactive;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {statusConfig.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      percent: {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-500/20",
        icon: Percent,
        label: "Porcentaje",
      },
      fixed: {
        bg: "bg-purple-50 dark:bg-purple-500/10",
        text: "text-purple-700 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-500/20",
        icon: DollarSign,
        label: "Monto Fijo",
      },
    };

    const typeConfig = config[type] || config.fixed;
    const Icon = typeConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {typeConfig.label}
      </span>
    );
  };

  const getUsageProgress = (used = 0, limit) => {
    if (limit === null || limit === undefined) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {used}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            / Ilimitado
          </span>
        </div>
      );
    }

    const percentage = (used / limit) * 100;
    const color =
      percentage >= 90
        ? "bg-red-500 dark:bg-red-600"
        : percentage >= 70
          ? "bg-amber-500 dark:bg-amber-600"
          : "bg-emerald-500 dark:bg-emerald-600";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
          <span className="font-medium">
            {used} / {limit}
          </span>
          <span className="font-medium">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {[
                "Código",
                "Descuento",
                "Tipo",
                "Uso",
                "Período de Validez",
                "Estado",
                "Acciones",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider ${
                    header === "Acciones"
                      ? "text-right text-gray-600 dark:text-gray-300"
                      : "text-left text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">No se encontraron cupones</p>
                  <p className="text-sm mt-1">
                    Intenta ajustar los filtros o crear un nuevo cupón
                  </p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon.coupon_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                        {coupon.code}
                      </div>
                      {coupon.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                          {coupon.description.substring(0, 60)}
                          {coupon.description.length > 60 ? "..." : ""}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {coupon.type === "percent"
                        ? `${coupon.discount}%`
                        : `Q${parseFloat(coupon.discount).toFixed(2)}`}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(coupon.type)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-40">
                      {getUsageProgress(
                        coupon.used_count || 0,
                        coupon.usage_limit
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div>{formatDate(coupon.valid_from)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          hasta
                        </div>
                        <div>{formatDate(coupon.valid_until)}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Editar cupón"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden xl:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => onDelete(coupon.coupon_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={coupon.used_count > 0}
                        title={
                          coupon.used_count > 0
                            ? "No se pueden eliminar cupones usados"
                            : "Eliminar cupón"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden xl:inline">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {coupons.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No se encontraron cupones</p>
            <p className="text-sm mt-1">
              Intenta ajustar los filtros o crear un nuevo cupón
            </p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.coupon_id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-base font-bold text-gray-900 dark:text-white font-mono mb-1">
                    {coupon.code}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(coupon.type)}
                    {getStatusBadge(coupon.status)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {coupon.type === "percent"
                      ? `${coupon.discount}%`
                      : `$${parseFloat(coupon.discount).toFixed(2)}`}
                  </div>
                </div>
              </div>

              {/* Description */}
              {coupon.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {coupon.description}
                </p>
              )}

              {/* Usage Progress */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Uso del cupón
                </p>
                {getUsageProgress(coupon.used_count || 0, coupon.usage_limit)}
              </div>

              {/* Valid Period */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(coupon.valid_from)} -{" "}
                  {formatDate(coupon.valid_until)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onEdit(coupon)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(coupon.coupon_id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={coupon.used_count > 0}
                  title={
                    coupon.used_count > 0
                      ? "No se pueden eliminar cupones usados"
                      : "Eliminar cupón"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando página{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pagination.page}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pagination.totalPages}
              </span>{" "}
              ({" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pagination.total}
              </span>{" "}
              cupones en total)
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(1)}
                disabled={pagination.page === 1}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Primera página"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </button>

              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Page Numbers */}
              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => {
                    const current = pagination.page;
                    return (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= current - 1 && pageNum <= current + 1)
                    );
                  })
                  .map((pageNum, idx, arr) => (
                    <React.Fragment key={pageNum}>
                      {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => onPageChange(pageNum)}
                        className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === pagination.page
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Última página"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
