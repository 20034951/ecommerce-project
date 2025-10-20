import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Eye,
  RefreshCw,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../../components/ui';
import { useDashboardStats, useLowStockProducts, useRecentOrders } from '../../../hooks/useDashboard';

// Configuración de colores para los estados de pedidos
const ORDER_STATUS_COLORS = {
  pending: '#64748b',    // slate-500
  paid: '#10b981',       // emerald-500
  processing: '#f59e0b', // amber-500
  shipped: '#3b82f6',    // blue-500
  delivered: '#22c55e',  // green-500
  cancelled: '#ef4444'   // red-500
};

const ORDER_STATUS_LABELS = {
  pending: 'Pendientes',
  paid: 'Pagados',
  processing: 'Procesando',
  shipped: 'Enviados',
  delivered: 'Entregados',
  cancelled: 'Cancelados'
};

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = useDashboardStats();
  const { data: lowStockProducts = [], isLoading: isLoadingLowStock } = useLowStockProducts(10);
  const { data: recentOrders = [], isLoading: isLoadingOrders } = useRecentOrders(5);

  // Procesar datos de órdenes para gráficos
  const ordersData = stats?.orders || [];
  
  // Calcular totales
  const totalOrders = ordersData.reduce((sum, stat) => sum + parseInt(stat.count || 0), 0);
  const totalRevenue = ordersData.reduce((sum, stat) => sum + parseFloat(stat.total || 0), 0);
  
  // Datos para gráfico de barras
  const barChartData = ordersData.map(stat => ({
    status: ORDER_STATUS_LABELS[stat.status] || stat.status,
    cantidad: parseInt(stat.count || 0),
    monto: parseFloat(stat.total || 0)
  }));

  // Datos para gráfico circular
  const pieChartData = ordersData.map(stat => ({
    name: ORDER_STATUS_LABELS[stat.status] || stat.status,
    value: parseInt(stat.count || 0),
    color: ORDER_STATUS_COLORS[stat.status] || '#94a3b8'
  }));

  const formatCurrency = (amount) => {
    return `Q. ${parseFloat(amount || 0).toLocaleString('es-GT', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoadingStats) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido al panel de control principal
          </p>
        </div>
        <Button
          onClick={() => refetchStats()}
          variant="outline"
          className="border-2 hover:border-indigo-400 dark:hover:border-indigo-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Usuarios */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Usuarios
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Productos */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Productos
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {stats?.totalProducts || 0}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Package className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Ventas */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ventas Totales
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Pedidos */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Pedidos
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-indigo-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categorías
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {stats?.totalCategories || 0}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Layers className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos con Stock Bajo */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Stock Bajo
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {lowStockProducts.length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Requieren atención
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Pedidos por Estado */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Pedidos por Estado
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Total de pedidos: <strong className="text-gray-900 dark:text-white">{totalOrders}</strong></span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <span>Histórico completo del sistema</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="status" 
                    stroke="#6b7280" 
                    className="dark:stroke-gray-400"
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    className="dark:stroke-gray-400"
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                    formatter={(value, name) => {
                      if (name === 'Cantidad') {
                        return [`${value} pedidos`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="cantidad" fill="#8b5cf6" name="Cantidad" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No hay datos de pedidos disponibles
              </div>
            )}
            {barChartData.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-900 dark:text-purple-100 font-medium">
                  📊 Información del gráfico
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Este gráfico muestra la cantidad de pedidos agrupados por su estado actual. 
                  Los datos incluyen todos los pedidos históricos registrados en el sistema.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Circular - Distribución de Pedidos */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Distribución de Pedidos
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>Vista porcentual por estado</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <span>Datos acumulados</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {pieChartData.length > 0 && pieChartData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                    formatter={(value, name) => [`${value} pedidos (${((value / totalOrders) * 100).toFixed(1)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No hay datos de pedidos disponibles
              </div>
            )}
            {pieChartData.length > 0 && pieChartData.some(d => d.value > 0) && (
              <div className="mt-4 space-y-2">
                {/* Leyenda personalizada con información */}
                <div className="grid grid-cols-2 gap-2">
                  {pieChartData.filter(d => d.value > 0).map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                          {entry.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {entry.value} ({((entry.value / totalOrders) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Info box */}
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-xs text-indigo-900 dark:text-indigo-100 font-medium">
                    📊 Información del gráfico
                  </p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                    Distribución porcentual de {totalOrders} pedidos totales. Cada segmento representa 
                    la proporción de pedidos en cada estado del sistema.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Productos con Stock Bajo y Pedidos Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con Stock Bajo */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
            <div className="space-y-2">
              <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                Productos con Stock Bajo
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Umbral: <strong>≤ 10 unidades</strong></span>
                </div>
                <div className="hidden sm:block text-red-400">•</div>
                <span>Requieren reabastecimiento</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoadingLowStock ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Cargando...
              </div>
            ) : lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 font-semibold">
                      {product.stock_quantity} unidades
                    </Badge>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <Link
                    to="/admin/products"
                    className="block text-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium pt-2"
                  >
                    Ver todos ({lowStockProducts.length})
                  </Link>
                )}
                
                {/* Info adicional */}
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-900 dark:text-amber-100 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Acción recomendada
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    {lowStockProducts.length === 1 
                      ? 'Hay 1 producto que necesita reabastecimiento inmediato.'
                      : `Hay ${lowStockProducts.length} productos que necesitan reabastecimiento inmediato.`
                    } Considera actualizar el inventario pronto.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay productos con stock bajo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pedidos Recientes */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
            <div className="space-y-2">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Pedidos Recientes
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Últimos <strong>5 pedidos</strong></span>
                </div>
                <div className="hidden sm:block text-blue-400">•</div>
                <span>Ordenados por fecha de creación</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoadingOrders ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Cargando...
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          #{order.order_id}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user?.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <Link
                        to={`/admin/orders/${order.order_id}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Link>
                    </div>
                  </div>
                ))}
                <Link
                  to="/admin/orders"
                  className="block text-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium pt-2"
                >
                  Ver todos los pedidos
                </Link>
                
                {/* Info adicional */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                    ℹ️ Información
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Mostrando los {recentOrders.length} pedidos más recientes. 
                    Haz clic en "Ver" para acceder a los detalles completos de cada pedido.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay pedidos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
