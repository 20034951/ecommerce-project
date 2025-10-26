import React from "react";
import { Card, Table } from "../../../components/ui";
import { TrendingUp } from "lucide-react";
import { formatCurrency, formatInteger } from "../../../utils/formatCurrency";

/**
 * Tabla de top productos más vendidos
 */
export const TopProductsTable = ({
  data,
  title = "Top 10 Productos Más Vendidos",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay datos disponibles
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
        {title}
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                #
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Producto
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Categoría
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Cantidad Vendida
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ingresos
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Órdenes
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr
                key={product.product_id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : index === 1
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          : index === 2
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  {product.product_name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {product.category_name}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 dark:text-white">
                  {formatInteger(product.total_quantity_sold)}
                </td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(product.total_revenue)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-gray-300">
                  {formatInteger(product.total_orders)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default TopProductsTable;
