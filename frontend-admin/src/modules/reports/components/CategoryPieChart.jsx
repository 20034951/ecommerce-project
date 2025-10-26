import React from "react";
import { Card } from "../../../components/ui";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../../utils/formatCurrency";

/**
 * Gráfica de pie para ventas por categoría
 * Colores no saturados sin degradados
 */
export const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Distribución de Ventas por Categoría
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay datos disponibles
        </p>
      </Card>
    );
  }

  // Colores no saturados
  const COLORS = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#3b82f6", // blue
    "#ef4444", // red
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ];

  const chartData = data.map((item) => ({
    name: item.category_name,
    value: item.total_revenue,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Distribución de Ventas por Categoría
      </h3>
      <div className="w-full flex justify-center">
        <ResponsiveContainer width="100%" height={400} minWidth={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="70%"
              maxRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value, entry) => (
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CategoryPieChart;
