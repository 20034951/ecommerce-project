import React from "react";
import { Card } from "../../../components/ui";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Ticket, TrendingDown, Users, Hash } from "lucide-react";

/**
 * Componente para mostrar estadísticas de cupones de descuento
 */
export const CouponsStatistics = ({ data }) => {
  if (!data || !data.summary) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No hay datos de cupones disponibles</p>
        </div>
      </Card>
    );
  }

  const { summary, coupons = [] } = data;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/20 border-pink-200 dark:border-pink-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                Cupones Únicos
              </p>
              <p className="text-2xl font-bold text-pink-900 dark:text-pink-100 mt-1">
                {summary.unique_coupons_count}
              </p>
              <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                Diferentes códigos
              </p>
            </div>
            <div className="p-3 bg-pink-500 rounded-lg">
              <Hash className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Total Usado
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {summary.total_coupons_used}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Veces utilizados
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Pedidos con Cupón
              </p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                {summary.total_orders_with_coupons}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Órdenes totales
              </p>
            </div>
            <div className="p-3 bg-amber-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Descuentos Emitidos
              </p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                {formatCurrency(summary.total_discount_amount)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Total ahorrado
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de cupones más usados */}
      {coupons.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cupones Más Utilizados
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Código de Cupón
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Veces Usado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descuento Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descuento Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.coupon_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg mr-3">
                          <Ticket className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                          {coupon.coupon_code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.discount_type === "percent"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        }`}
                      >
                        {coupon.discount_type === "percent"
                          ? "Porcentaje"
                          : "Monto Fijo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900 dark:text-white">
                      {coupon.discount_type === "percent"
                        ? `${coupon.discount_value}%`
                        : formatCurrency(coupon.discount_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {coupon.times_used}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(coupon.total_discount_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(
                        coupon.total_discount_amount / coupon.times_used
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Insights adicionales */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
          <Ticket className="h-5 w-5 mr-2" />
          Insights de Cupones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Promedio de Descuento por Cupón
            </p>
            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {coupons.length > 0
                ? formatCurrency(
                    summary.total_discount_amount / summary.unique_coupons_count
                  )
                : "Q0.00"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Promedio de Uso por Cupón
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {coupons.length > 0
                ? (
                    summary.total_coupons_used / summary.unique_coupons_count
                  ).toFixed(1)
                : "0"}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                veces
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CouponsStatistics;
