import React from "react";
import { Package, Tag, TrendingUp, Layers } from "lucide-react";

export default function CategoryStats({ categories }) {
  const categoriesList = Array.isArray(categories) ? categories : [];

  const stats = {
    total: categoriesList.length,
    totalProducts: categoriesList.reduce(
      (sum, cat) => sum + (cat.productCount || 0),
      0
    ),
    withProducts: categoriesList.filter((cat) => cat.productCount > 0).length,
    empty: categoriesList.filter(
      (cat) => !cat.productCount || cat.productCount === 0
    ).length,
  };

  const avgProductsPerCategory =
    stats.total > 0 ? (stats.totalProducts / stats.total).toFixed(1) : 0;

  const statCards = [
    {
      label: "Total Categorías",
      value: stats.total,
      icon: Tag,
      color: "indigo",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      color: "emerald",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Con Productos",
      value: stats.withProducts,
      icon: Layers,
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Promedio por Categoría",
      value: avgProductsPerCategory,
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
