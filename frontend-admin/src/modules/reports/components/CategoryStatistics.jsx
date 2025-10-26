import React from "react";
import { Card, Tooltip } from "../../../components/ui";
import { formatCurrency, formatNumber } from "../../../utils/formatCurrency";
import { BarChart3, TrendingUp, Target, Activity } from "lucide-react";

/**
 * Componente de estadísticas avanzadas por categoría
 * Muestra análisis estadístico detallado de ventas por categoría
 */
export const CategoryStatistics = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Calcular estadísticas
  const revenues = data.map((item) => item.total_revenue);
  const quantities = data.map((item) => item.total_items_sold);

  // Totales
  const totalRevenue = revenues.reduce((sum, val) => sum + val, 0);
  const totalQuantity = quantities.reduce((sum, val) => sum + val, 0);

  // Media (promedio)
  const meanRevenue = totalRevenue / revenues.length;
  const meanQuantity = totalQuantity / quantities.length;

  // Mínimos y Máximos
  const minRevenue = Math.min(...revenues);
  const maxRevenue = Math.max(...revenues);
  const minQuantity = Math.min(...quantities);
  const maxQuantity = Math.max(...quantities);

  // Categorías con valores extremos
  const topCategory = data.find((item) => item.total_revenue === maxRevenue);
  const bottomCategory = data.find((item) => item.total_revenue === minRevenue);
  const topQuantityCategory = data.find(
    (item) => item.total_items_sold === maxQuantity
  );

  // Varianza y Desviación Estándar (ingresos)
  const varianceRevenue =
    revenues.reduce((sum, val) => {
      return sum + Math.pow(val - meanRevenue, 2);
    }, 0) / revenues.length;
  const stdDevRevenue = Math.sqrt(varianceRevenue);

  // Varianza y Desviación Estándar (cantidad)
  const varianceQuantity =
    quantities.reduce((sum, val) => {
      return sum + Math.pow(val - meanQuantity, 2);
    }, 0) / quantities.length;
  const stdDevQuantity = Math.sqrt(varianceQuantity);

  // Moda (valor más frecuente - aproximado por rangos)
  const revenueRanges = revenues.map((r) => Math.floor(r / 10000) * 10000);
  const frequencyMap = {};
  revenueRanges.forEach((range) => {
    frequencyMap[range] = (frequencyMap[range] || 0) + 1;
  });
  const mode = Object.keys(frequencyMap).reduce((a, b) =>
    frequencyMap[a] > frequencyMap[b] ? a : b
  );

  // Mediana
  const sortedRevenues = [...revenues].sort((a, b) => a - b);
  const mid = Math.floor(sortedRevenues.length / 2);
  const medianRevenue =
    sortedRevenues.length % 2 !== 0
      ? sortedRevenues[mid]
      : (sortedRevenues[mid - 1] + sortedRevenues[mid]) / 2;

  const sortedQuantities = [...quantities].sort((a, b) => a - b);
  const midQ = Math.floor(sortedQuantities.length / 2);
  const medianQuantity =
    sortedQuantities.length % 2 !== 0
      ? sortedQuantities[midQ]
      : (sortedQuantities[midQ - 1] + sortedQuantities[midQ]) / 2;

  // Coeficiente de variación (%)
  const cvRevenue = (stdDevRevenue / meanRevenue) * 100;
  const cvQuantity = (stdDevQuantity / meanQuantity) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600" />
        Análisis Estadístico por Categoría
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Media */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Media de Ingresos
            </p>
            <Tooltip
              content={`📊 MEDIA (PROMEDIO)

Fórmula: μ = Σx / n

Parámetros:
• Σx = Suma de todos los ingresos por categoría
• n = Número total de categorías (${data.length})

Interpretación:
Representa el ingreso promedio por categoría. Es útil para identificar el comportamiento general del negocio y comparar categorías individuales contra este valor de referencia.`}
            />
          </div>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(meanRevenue)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Promedio: {formatNumber(meanQuantity)} unidades
          </p>
        </div>

        {/* Mediana */}
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 p-4 rounded-lg border border-violet-200 dark:border-violet-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-violet-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mediana de Ingresos
            </p>
            <Tooltip
              content={`📊 MEDIANA

Cálculo:
1. Ordenar todos los ingresos de menor a mayor
2. Si n es impar: valor central
3. Si n es par: promedio de los 2 valores centrales

Parámetros:
• n = ${data.length} categorías
• Datos ordenados de menor a mayor

Interpretación:
Valor que divide los datos en dos partes iguales. Es más resistente a valores extremos que la media. Si mediana < media, indica que pocas categorías tienen ingresos muy altos.`}
            />
          </div>
          <p className="text-2xl font-bold text-violet-600">
            {formatCurrency(medianRevenue)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Mediana: {formatNumber(medianQuantity)} unidades
          </p>
        </div>

        {/* Desviación Estándar */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Desviación Estándar
            </p>
            <Tooltip
              content={`📊 DESVIACIÓN ESTÁNDAR

Fórmula: σ = √(Σ(x - μ)² / n)

Parámetros:
• x = Ingreso de cada categoría
• μ = Media de ingresos (${formatCurrency(meanRevenue)})
• n = ${data.length} categorías

Coeficiente de Variación (CV):
CV = (σ / μ) × 100 = ${cvRevenue.toFixed(1)}%

Interpretación:
Mide la dispersión de los datos respecto a la media. Un CV alto (>${cvRevenue.toFixed(1)}%) indica gran variabilidad entre categorías. CV bajo indica ventas homogéneas.`}
            />
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {formatCurrency(stdDevRevenue)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            CV: {cvRevenue.toFixed(1)}%
          </p>
        </div>

        {/* Moda */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rango Modal
            </p>
            <Tooltip
              content={`📊 MODA (Rango Aproximado)

Cálculo:
1. Agrupar ingresos en rangos de Q. 10,000
2. Contar frecuencia de cada rango
3. Identificar el rango con mayor frecuencia

Parámetros:
• Rangos: incrementos de Q. 10,000
• Datos agrupados: ${data.length} categorías

Interpretación:
Representa el rango de ingresos más común entre las categorías. Útil para identificar el comportamiento típico del negocio y detectar patrones de concentración.`}
            />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(Number(mode))}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Más frecuente
          </p>
        </div>
      </div>

      {/* Tabla de valores extremos */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Máximo Revenue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mayor Ingreso
          </p>
          <p className="text-xl font-bold text-emerald-600 mb-1">
            {formatCurrency(maxRevenue)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {topCategory?.category_name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(topCategory?.total_items_sold)} unidades vendidas
          </p>
        </div>

        {/* Mínimo Revenue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Menor Ingreso
          </p>
          <p className="text-xl font-bold text-red-600 mb-1">
            {formatCurrency(minRevenue)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {bottomCategory?.category_name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(bottomCategory?.total_items_sold)} unidades vendidas
          </p>
        </div>

        {/* Mayor Cantidad */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mayor Volumen
          </p>
          <p className="text-xl font-bold text-blue-600 mb-1">
            {formatNumber(maxQuantity)} unidades
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {topQuantityCategory?.category_name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(topQuantityCategory?.total_revenue)} en ingresos
          </p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Resumen Estadístico
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Varianza (Ingresos)
              </p>
              <Tooltip
                content={`📊 VARIANZA DE INGRESOS

Fórmula: σ² = Σ(x - μ)² / n

Interpretación:
Mide la dispersión promedio al cuadrado. Un valor alto indica que los ingresos de las categorías están muy dispersos respecto a la media.`}
              />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatNumber(varianceRevenue)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Varianza (Cantidad)
              </p>
              <Tooltip
                content={`📊 VARIANZA DE CANTIDAD

Fórmula: σ² = Σ(x - μ)² / n

Interpretación:
Dispersión de las unidades vendidas. Permite identificar si algunas categorías venden significativamente más unidades que otras.`}
              />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatNumber(varianceQuantity)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rango Ingresos
              </p>
              <Tooltip
                content={`📊 RANGO DE INGRESOS

Fórmula: Rango = Máximo - Mínimo

Valores:
• Máximo: ${formatCurrency(maxRevenue)}
• Mínimo: ${formatCurrency(minRevenue)}

Interpretación:
Diferencia entre la categoría con mayores y menores ingresos. Un rango amplio indica gran desigualdad entre categorías.`}
              />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(maxRevenue - minRevenue)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rango Cantidad
              </p>
              <Tooltip
                content={`📊 RANGO DE CANTIDAD

Fórmula: Rango = Máximo - Mínimo

Valores:
• Máximo: ${formatNumber(maxQuantity)} unidades
• Mínimo: ${formatNumber(minQuantity)} unidades

Interpretación:
Diferencia entre las unidades vendidas por la categoría más y menos popular. Indica la brecha de popularidad entre categorías.`}
              />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatNumber(maxQuantity - minQuantity)} unidades
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryStatistics;
