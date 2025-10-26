import React from "react";
import { Card } from "../../../components/ui";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  XCircle,
  CheckCircle,
  TrendingDown,
  Package,
  CreditCard,
  Ticket,
} from "lucide-react";
import { formatCurrency, formatInteger } from "../../../utils/formatCurrency";

/**
 * Tarjetas de métricas con iconos
 * Colores no saturados sin degradados
 */
export const MetricsCards = ({ summary }) => {
  if (!summary) return null;

  // Calcular porcentaje de ingresos perdidos sobre el total
  const lostRevenuePercentage =
    summary.totalRevenue > 0
      ? (
          (summary.lostRevenue / (summary.totalRevenue + summary.lostRevenue)) *
          100
        ).toFixed(2)
      : 0;

  const metrics = [
    {
      title: "Ingresos Totales",
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Órdenes Completadas",
      value: formatInteger(summary.completedOrders),
      subtitle: `${summary.completionRate}% del total`,
      icon: CheckCircle,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Órdenes Canceladas",
      value: formatInteger(summary.cancelledOrders),
      subtitle: `${summary.cancellationRate}% del total`,
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      title: "Valor Promedio por Orden",
      value: formatCurrency(summary.averageOrderValue),
      icon: TrendingUp,
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-200 dark:border-violet-800",
    },
    {
      title: "Total de Órdenes",
      value: formatInteger(summary.totalOrders),
      icon: ShoppingCart,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      title: "Ingresos Perdidos",
      value: formatCurrency(summary.lostRevenue),
      subtitle: `${lostRevenuePercentage}% del total potencial`,
      icon: TrendingDown,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ];

  // Agregar métrica de método de pago más usado si existe
  if (summary.paymentMethods?.mostUsed) {
    metrics.push({
      title: "Método de Pago Más Usado",
      value: summary.paymentMethods.mostUsed.name,
      subtitle: `${summary.paymentMethods.mostUsed.count} pedidos - ${formatCurrency(summary.paymentMethods.mostUsed.revenue)}`,
      icon: CreditCard,
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    });
  }

  // Agregar métrica de cupones si existe
  if (summary.coupons) {
    metrics.push({
      title: "Descuentos Emitidos",
      value: formatCurrency(summary.coupons.totalDiscountAmount),
      subtitle: `${summary.coupons.ordersWithCoupons} pedidos con cupón (${summary.coupons.percentageOrdersWithCoupons}%)`,
      icon: Ticket,
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
      borderColor: "border-pink-200 dark:border-pink-800",
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className={`p-4 border-2 ${metric.borderColor} ${metric.bgColor} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metric.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;
