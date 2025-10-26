import React from "react";
import { Card } from "../../../components/ui";
import { TrendingUp, Award, AlertCircle } from "lucide-react";
import { formatCurrency, formatInteger } from "../../../utils/formatCurrency";

/**
 * Componente de insights y análisis de ventas por categoría
 */
export const CategoryInsights = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Calcular insights
  const totalRevenue = data.reduce((sum, cat) => sum + cat.total_revenue, 0);
  const totalItems = data.reduce((sum, cat) => sum + cat.total_items_sold, 0);
  const topCategory = data[0];
  const bottomCategory = data[data.length - 1];
  const topCategoryPercentage =
    totalRevenue > 0
      ? ((topCategory.total_revenue / totalRevenue) * 100).toFixed(1)
      : 0;

  return (
    <Card className="p-4 mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        Análisis de Ventas por Categoría
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Award className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Categoría Líder
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-amber-600">
                {topCategory.category_name}
              </span>{" "}
              representa el {topCategoryPercentage}% de las ventas totales con{" "}
              {formatCurrency(topCategory.total_revenue)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Volumen Total
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Se vendieron{" "}
              <span className="font-semibold text-emerald-600">
                {formatInteger(totalItems)} unidades
              </span>{" "}
              distribuidas en {data.length} categorías diferentes
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Oportunidad
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              La categoría{" "}
              <span className="font-semibold text-blue-600">
                {bottomCategory.category_name}
              </span>{" "}
              tiene potencial de crecimiento con{" "}
              {formatCurrency(bottomCategory.total_revenue)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryInsights;
