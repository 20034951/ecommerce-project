import React from "react";
import { Card } from "../../../components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../../utils/formatCurrency";

/**
 * Gráfica de ventas por categoría
 * Colores no saturados sin degradados
 */
export const CategorySalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Ventas por Categoría
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay datos disponibles
        </p>
      </Card>
    );
  }

  // Colores no saturados
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#06b6d4",
  ];

  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Ventas por Categoría
      </h3>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="category_name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                width={50}
                tickFormatter={(value) => `Q${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar
                dataKey="total_revenue"
                fill="#6366f1"
                name="Ingresos"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default CategorySalesChart;
