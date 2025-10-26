import React, { useState, useRef } from "react";
import { Card } from "../../../components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatInteger } from "../../../utils/formatCurrency";

/**
 * Gráfica de comparación de ventas diarias
 * Muestra el periodo actual vs el periodo anterior
 */
export const SalesOverTimeChart = ({
  data,
  comparison,
  groupBy = "day",
  onFilterChange,
  daysValue = 7,
}) => {
  const [daysToCompare, setDaysToCompare] = useState(daysValue);
  const chartRef = useRef(null);

  // Sincronizar con el valor externo
  React.useEffect(() => {
    setDaysToCompare(daysValue);
  }, [daysValue]);

  // Si no hay datos de comparación, solo mostrar datos actuales
  if (!comparison || !comparison.current || comparison.current.length === 0) {
    return (
      <div ref={chartRef}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Tendencia de Ventas {groupBy === "month" ? "Mensual" : "Diaria"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay datos disponibles para comparación
          </p>
        </Card>
      </div>
    );
  }

  // Preparar datos para la gráfica combinando actual y anterior
  const chartData = comparison.current.map((current, index) => {
    const previous = comparison.previous[index] || {};
    return {
      date: current.date,
      current_revenue: current.total_revenue,
      previous_revenue: previous.total_revenue || 0,
    };
  });

  // Calcular totales para la tarjeta de comparación
  const currentTotal = comparison.current.reduce(
    (sum, item) => sum + item.total_revenue,
    0
  );
  const previousTotal = comparison.previous.reduce(
    (sum, item) => sum + item.total_revenue,
    0
  );
  const currentOrders = comparison.current.reduce(
    (sum, item) => sum + item.total_orders,
    0
  );
  const previousOrders = comparison.previous.reduce(
    (sum, item) => sum + item.total_orders,
    0
  );

  const percentageChange =
    previousTotal > 0
      ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
      : 0;
  const trend =
    percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "stable";

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 365) {
      setDaysToCompare(value);
      if (onFilterChange) {
        onFilterChange(value);
      }
    }
  };

  return (
    <div ref={chartRef} className="space-y-4">
      {/* Tarjeta de comparación */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparación de Periodos
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Comparar últimos
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={daysToCompare}
              onChange={handleDaysChange}
              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              días
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Periodo Actual */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              Periodo Actual
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
              {formatInteger(currentOrders)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
              {formatCurrency(currentTotal)} en ventas
            </p>
          </div>

          {/* Periodo Anterior */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              Periodo Anterior
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">
              {formatInteger(previousOrders)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
              {formatCurrency(previousTotal)} en ventas
            </p>
          </div>
        </div>

        {/* Indicador de tendencia */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-3xl sm:text-4xl font-bold ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            <div className="text-center">
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  trend === "up"
                    ? "text-emerald-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {Math.abs(percentageChange)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {trend === "up"
                  ? "Incremento"
                  : trend === "down"
                    ? "Disminución"
                    : "Sin cambio"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfica de tendencia */}
      <Card className="p-4 sm:p-6 overflow-hidden">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Tendencia de Ventas {groupBy === "month" ? "Mensual" : "Diaria"}
        </h3>
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: "600px", width: "100%" }}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={(value) => `Q${(value / 1000).toFixed(0)}k`}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === "current_revenue"
                      ? "Periodo Actual"
                      : "Periodo Anterior",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) =>
                    value === "current_revenue"
                      ? "Periodo Actual"
                      : "Periodo Anterior"
                  }
                />
                {/* Línea del periodo anterior (punteada, al fondo) */}
                <Line
                  type="monotone"
                  dataKey="previous_revenue"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="previous_revenue"
                  dot={{ fill: "#94a3b8", r: 2 }}
                  activeDot={{ r: 5 }}
                />
                {/* Línea del periodo actual (sólida, al frente) */}
                <Line
                  type="monotone"
                  dataKey="current_revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="current_revenue"
                  dot={{ fill: "#6366f1", r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesOverTimeChart;
