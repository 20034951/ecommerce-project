import React, { useState, useEffect } from "react";
import {
  MetricsCards,
  CategorySalesChart,
  SalesOverTimeChart,
  TopProductsTable,
  CategoryPieChart,
  CategoryInsights,
  CategoryStatistics,
  DynamicTopInput,
  PaymentMethodsChart,
  CouponsStatistics,
} from "../components";
import { useReports } from "../hooks/useReports";
import {
  Card,
  Button,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui";
import {
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  TrendingUp,
  Package,
  PieChart,
  CreditCard,
  Ticket,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

/**
 * Página principal de reportes de ventas con Tabs
 * Organizada por secciones: Resumen, Tendencias, Categorías, Top Productos
 * Con persistencia de estado en localStorage
 */
export const ReportsPage = () => {
  // Cargar estado desde localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(`reports_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Estado para fechas separadas
  const [startDate, setStartDate] = useState(() =>
    loadFromStorage("startDate", new Date().toISOString().split("T")[0])
  );
  const [endDate, setEndDate] = useState(() =>
    loadFromStorage("endDate", new Date().toISOString().split("T")[0])
  );
  const [quickRange, setQuickRange] = useState(() =>
    loadFromStorage("quickRange", "today")
  );
  const [groupBy, setGroupBy] = useState(() =>
    loadFromStorage("groupBy", "day")
  );
  const [topLimit, setTopLimit] = useState(() =>
    loadFromStorage("topLimit", 10)
  );
  const [selectedCategory, setSelectedCategory] = useState(() =>
    loadFromStorage("selectedCategory", "")
  );
  const [activeTab, setActiveTab] = useState(() =>
    loadFromStorage("activeTab", "overview")
  );
  const [daysToCompare, setDaysToCompare] = useState(() =>
    loadFromStorage("daysToCompare", 7)
  );

  // Hook de reportes
  const {
    summary,
    categorySales,
    topProducts,
    salesOverTime,
    salesComparison,
    paymentMethods,
    coupons,
    loading,
    error,
    loadAllReports,
    loadSalesOverTime,
    loadSalesComparison,
    loadTopProducts,
    loadFirstOrderDate,
    loadPaymentMethods,
    loadCoupons,
  } = useReports();

  // Guardar en localStorage cuando cambian los estados
  useEffect(() => {
    localStorage.setItem("reports_startDate", JSON.stringify(startDate));
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem("reports_endDate", JSON.stringify(endDate));
  }, [endDate]);

  useEffect(() => {
    localStorage.setItem("reports_quickRange", JSON.stringify(quickRange));
  }, [quickRange]);

  useEffect(() => {
    localStorage.setItem("reports_groupBy", JSON.stringify(groupBy));
  }, [groupBy]);

  useEffect(() => {
    localStorage.setItem("reports_topLimit", JSON.stringify(topLimit));
  }, [topLimit]);

  useEffect(() => {
    localStorage.setItem(
      "reports_selectedCategory",
      JSON.stringify(selectedCategory)
    );
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("reports_activeTab", JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(
      "reports_daysToCompare",
      JSON.stringify(daysToCompare)
    );
  }, [daysToCompare]);

  // Cargar reportes al montar el componente
  useEffect(() => {
    handleLoadReports();
  }, []);

  // Manejar cambio de rango rápido
  const handleQuickRangeChange = async (range) => {
    setQuickRange(range);
    const today = new Date();
    const end = new Date(today);
    let start = new Date(today);

    switch (range) {
      case "today":
        // Mismo día
        break;
      case "7days":
        start.setDate(start.getDate() - 6);
        break;
      case "15days":
        start.setDate(start.getDate() - 14);
        break;
      case "30days":
        start.setDate(start.getDate() - 29);
        break;
      case "alltime":
        // Obtener la fecha de la primera orden
        const firstOrderDate = await loadFirstOrderDate();
        start = new Date(firstOrderDate);
        break;
      default:
        break;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  // Cargar reportes con filtros actuales
  const handleLoadReports = async () => {
    const filters = { startDate, endDate };

    await loadAllReports(filters);
    await loadSalesOverTime({ ...filters, groupBy });
    await loadPaymentMethods(filters);
    await loadCoupons(filters);

    if (startDate && endDate) {
      await loadSalesComparison({ ...filters, groupBy });
    }

    // Construir parámetros para top productos
    const topProductsParams = {
      ...filters,
      limit: topLimit,
    };

    // Solo agregar category_id si hay una categoría seleccionada
    if (selectedCategory) {
      topProductsParams.category_id = selectedCategory;
    }

    await loadTopProducts(topProductsParams);
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    handleLoadReports();
  };

  // Resetear filtros
  const handleResetFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
    setQuickRange("today");
    setGroupBy("day");
    setTopLimit(10);
    setSelectedCategory("");
    loadAllReports({
      startDate: today,
      endDate: today,
    });
    loadSalesOverTime({ startDate: today, endDate: today, groupBy: "day" });
    loadSalesComparison({ startDate: today, endDate: today, groupBy: "day" });
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    if (!summary || !categorySales || !topProducts) {
      alert("No hay datos para exportar");
      return;
    }

    let csvContent = "\uFEFF";
    csvContent += "RESUMEN DE VENTAS\n";
    csvContent += `Total Órdenes,${summary.totalOrders}\n`;
    csvContent += `Órdenes Completadas,${summary.completedOrders}\n`;
    csvContent += `Órdenes Canceladas,${summary.cancelledOrders}\n`;
    csvContent += `Tasa de Cancelación,${summary.cancellationRate}%\n`;
    csvContent += `Ingresos Totales,${formatCurrency(summary.totalRevenue)}\n`;
    csvContent += `Ingresos Perdidos,${formatCurrency(summary.lostRevenue)}\n`;
    csvContent += `Valor Promedio por Orden,${formatCurrency(summary.averageOrderValue)}\n\n`;

    csvContent += "VENTAS POR CATEGORÍA\n";
    csvContent += "Categoría,Ingresos,Items Vendidos,Órdenes\n";
    categorySales.forEach((cat) => {
      csvContent += `${cat.category_name},${formatCurrency(cat.total_revenue)},${cat.total_items_sold},${cat.total_orders}\n`;
    });
    csvContent += "\n";

    csvContent += "TOP PRODUCTOS\n";
    csvContent += "Producto,Categoría,Cantidad Vendida,Ingresos,Órdenes\n";
    topProducts.forEach((prod) => {
      csvContent += `${prod.product_name},${prod.category_name},${prod.total_quantity_sold},${formatCurrency(prod.total_revenue)},${prod.total_orders}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte-ventas-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Cambiar agrupación de tiempo
  const handleGroupByChange = (newGroupBy) => {
    setGroupBy(newGroupBy);
    const filters = { startDate, endDate };
    loadSalesOverTime({ ...filters, groupBy: newGroupBy });
    loadSalesComparison({ ...filters, groupBy: newGroupBy });
  };

  // Cambiar límite de top productos (con debounce desde el input)
  const handleTopLimitChange = (newLimit) => {
    setTopLimit(newLimit);

    // Construir parámetros
    const params = {
      startDate,
      endDate,
      limit: newLimit,
    };

    // Solo agregar category_id si hay una categoría seleccionada
    if (selectedCategory) {
      params.category_id = selectedCategory;
    }

    loadTopProducts(params);
  };

  // Cargar top productos por categoría
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);

    // Construir parámetros
    const params = {
      startDate,
      endDate,
      limit: topLimit,
    };

    // Solo agregar category_id si hay una categoría seleccionada
    if (categoryId) {
      params.category_id = categoryId;
    }

    await loadTopProducts(params);
  };

  // Manejar cambio de días de comparación con debounce
  const handleDaysComparisonChange = async (days) => {
    // Guardar el valor de días para persistencia
    setDaysToCompare(days);

    // No recalcular fechas, mantener las fechas actuales del filtro
    // Solo recargar la comparación con las fechas existentes
    const filters = { startDate, endDate };

    await loadSalesComparison({ ...filters, groupBy });
    await loadSalesOverTime({ ...filters, groupBy });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reportes de Ventas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Análisis detallado de ventas, ganancias y rendimiento
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Rangos rápidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rango Rápido
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "today", label: "Hoy" },
                  { value: "7days", label: "7 días" },
                  { value: "15days", label: "15 días" },
                  { value: "30days", label: "30 días" },
                  { value: "alltime", label: "Desde el inicio" },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleQuickRangeChange(range.value)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                      quickRange === range.value
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fechas personalizadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setQuickRange("custom");
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setQuickRange("custom");
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                disabled={loading}
                className="text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                disabled={loading || !summary}
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </Card>
        )}

        {/* Content con Tabs */}
        {!loading && !error && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="overview">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Resumen General</span>
                <span className="sm:hidden">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Tendencias</span>
                <span className="sm:hidden">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="categories">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Categorías</span>
                <span className="sm:hidden">Cats</span>
              </TabsTrigger>
              <TabsTrigger value="products">
                <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Top Productos</span>
                <span className="sm:hidden">Prods</span>
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Métodos de Pago</span>
                <span className="sm:hidden">Pagos</span>
              </TabsTrigger>
              <TabsTrigger value="coupons">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Cupones</span>
                <span className="sm:hidden">Cupones</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Resumen General */}
            <TabsContent value="overview">
              <MetricsCards summary={summary} />
            </TabsContent>

            {/* Tab 2: Tendencias de Ventas */}
            <TabsContent value="trends">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Comparación de Ventas
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGroupByChange("day")}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        groupBy === "day"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Diario
                    </button>
                    <button
                      onClick={() => handleGroupByChange("month")}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        groupBy === "month"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Mensual
                    </button>
                  </div>
                </div>
                <SalesOverTimeChart
                  comparison={salesComparison}
                  groupBy={groupBy}
                  onFilterChange={handleDaysComparisonChange}
                  daysValue={daysToCompare}
                />
              </div>
            </TabsContent>

            {/* Tab 3: Análisis por Categorías */}
            <TabsContent value="categories">
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="w-full">
                    <CategorySalesChart data={categorySales} />
                    <div className="mt-4">
                      <CategoryInsights data={categorySales} />
                    </div>
                  </div>
                  <div className="w-full">
                    <CategoryPieChart data={categorySales} />
                  </div>
                </div>
                <CategoryStatistics data={categorySales} />
              </div>
            </TabsContent>

            {/* Tab 4: Top Productos */}
            <TabsContent value="products">
              <div className="space-y-6">
                <Card className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Top Productos Más Vendidos
                    </h3>
                    <DynamicTopInput
                      value={topLimit}
                      onChange={handleTopLimitChange}
                      min={1}
                      max={1000}
                      label="Mostrar top"
                      placeholder="Ej: 10"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Filtrar por Categoría (opcional)
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Todas las categorías</option>
                      {categorySales.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <TopProductsTable
                      data={topProducts}
                      title={
                        selectedCategory
                          ? `Top ${topLimit} - ${categorySales.find((c) => c.category_id == selectedCategory)?.category_name || "Categoría"}`
                          : `Top ${topLimit} - Todas las Categorías`
                      }
                    />
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 5: Métodos de Pago */}
            <TabsContent value="payments">
              <PaymentMethodsChart data={paymentMethods} />
            </TabsContent>

            {/* Tab 6: Cupones */}
            <TabsContent value="coupons">
              <CouponsStatistics data={coupons} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
