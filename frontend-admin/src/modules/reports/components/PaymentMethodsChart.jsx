import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "../../../components/ui";
import { formatCurrency } from "../../../utils/formatCurrency";
import { CreditCard, Wallet, DollarSign, TrendingUp } from "lucide-react";

/**
 * Componente para mostrar estadísticas de métodos de pago
 * Incluye gráfica de barras y métricas individuales
 */
export const PaymentMethodsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No hay datos de métodos de pago disponibles</p>
        </div>
      </Card>
    );
  }

  // Colores para cada método de pago
  const COLORS = [
    "#6366F1", // Indigo
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ];

  // Calcular totales
  const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);

  // Método más popular
  const mostPopular = data.reduce(
    (max, item) => (item.total_orders > max.total_orders ? item : max),
    data[0]
  );

  // Método con más ingresos
  const highestRevenue = data.reduce(
    (max, item) => (item.total_revenue > max.total_revenue ? item : max),
    data[0]
  );

  // Formato personalizado para tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.method_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pedidos: <span className="font-medium">{data.total_orders}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingresos:{" "}
            <span className="font-medium">
              {formatCurrency(data.total_revenue)}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Porcentaje: <span className="font-medium">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Método Más Usado
              </p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                {mostPopular.method_name}
              </p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                {mostPopular.total_orders} pedidos
              </p>
            </div>
            <div className="p-3 bg-indigo-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Mayor Ingreso
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                {highestRevenue.method_name}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(highestRevenue.total_revenue)}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Total Métodos Activos
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {data.length}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {totalOrders} pedidos totales
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfica de barras */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ingresos por Método de Pago
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="method_name"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `Q${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="total_revenue" name="Ingresos" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabla detallada */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detalle por Método de Pago
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  % del Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Promedio por Pedido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {data.map((method, index) => (
                <tr
                  key={method.payment_method_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {method.method_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {method.method_code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {method.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(method.total_revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {method.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(method.total_revenue / method.total_orders)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                  TOTAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                  {totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                  100%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalRevenue / totalOrders)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethodsChart;
