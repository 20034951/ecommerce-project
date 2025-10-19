import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '../../../components/ui';
import { 
  Package, 
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  Banknote,
  User,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  CreditCard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { OrderFilters } from '../components';
import { useOrders } from '../../../hooks/useOrders';
import { useOrderStats } from '../../../hooks/useOrderStats';
import { ordersApi } from '../../../api/ordersApi';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    className: 'bg-slate-50 text-slate-800 border-2 border-slate-400 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-500 font-semibold',
    icon: Clock,
    iconColor: 'text-slate-600 dark:text-slate-300'
  },
  paid: {
    label: 'Pagado',
    className: 'bg-emerald-50 text-emerald-800 border-2 border-emerald-400 dark:bg-emerald-800/50 dark:text-emerald-100 dark:border-emerald-500 font-semibold',
    icon: CreditCard,
    iconColor: 'text-emerald-600 dark:text-emerald-300'
  },
  processing: {
    label: 'Procesando',
    className: 'bg-amber-50 text-amber-800 border-2 border-amber-400 dark:bg-amber-800/50 dark:text-amber-100 dark:border-amber-500 font-semibold',
    icon: Package,
    iconColor: 'text-amber-600 dark:text-amber-300'
  },
  shipped: {
    label: 'Enviado',
    className: 'bg-blue-50 text-blue-800 border-2 border-blue-400 dark:bg-blue-800/50 dark:text-blue-100 dark:border-blue-500 font-semibold',
    icon: Truck,
    iconColor: 'text-blue-600 dark:text-blue-300'
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-green-50 text-green-800 border-2 border-green-400 dark:bg-green-800/50 dark:text-green-100 dark:border-green-500 font-semibold',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-300'
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-50 text-red-800 border-2 border-red-400 dark:bg-red-800/50 dark:text-red-100 dark:border-red-500 font-semibold',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-300'
  }
};

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Usar hooks para cargar pedidos y estadísticas
  const { 
    data: ordersData, 
    isLoading, 
    error,
    refetch 
  } = useOrders(filters, { page: currentPage, limit: pageLimit });

  const {
    data: statsData,
    isLoading: isLoadingStats
  } = useOrderStats(filters);

  // Extraer datos de la respuesta
  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination || {
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 20
  };

  // Procesar estadísticas desde el formato del backend
  // Backend devuelve: { data: [{ status: 'pending', count: 5, total: '3602.34' }, ...] }
  const statsArray = statsData?.data || [];
  const stats = {
    totalOrders: statsArray.reduce((sum, stat) => sum + (stat.count || 0), 0),
    pendingOrders: statsArray.find(s => s.status === 'pending')?.count || 0,
    processingOrders: (statsArray.find(s => s.status === 'processing')?.count || 0) + 
                      (statsArray.find(s => s.status === 'shipped')?.count || 0),
    deliveredOrders: statsArray.find(s => s.status === 'delivered')?.count || 0
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Resetear a página 1 cuando cambian filtros
  };

  const handleLimitChange = (newLimit) => {
    setPageLimit(Number(newLimit));
    setCurrentPage(1); // Resetear a página 1 cuando cambia el límite
  };

  const handleRefresh = () => {
    refetch();
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(pagination.totalPages);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await ordersApi.exportOrders(filters);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar pedidos. Por favor, intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1.5 w-fit px-3 py-1.5`}>
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `Q${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Pedidos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Administra y supervisa todos los pedidos del sistema
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`border-2 transition-all ${
              showFilters 
                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' 
                : 'border-gray-300 hover:border-purple-400 dark:border-gray-600 dark:hover:border-purple-500'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            <span className="sm:hidden">Filtros</span>
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </div>

      {/* Stats Cards - Responsive con mejor diseño móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Pedidos - Azul vibrante */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Pedidos</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {isLoadingStats ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    stats.totalOrders || pagination.total || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Package className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pendientes - Amarillo/Naranja vibrante */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {isLoadingStats ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    stats.pendingOrders || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En Proceso - Morado vibrante */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">En Proceso</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {isLoadingStats ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    stats.processingOrders || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entregados - Verde esmeralda vibrante */}
        <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Entregados</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">
                  {isLoadingStats ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    stats.deliveredOrders || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avanzados */}
      {showFilters && (
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Orders Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Listado de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Cargando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-2">Error al cargar pedidos</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error.message || 'Ocurrió un error inesperado'}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No hay pedidos para mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-indigo-600 dark:bg-indigo-700 border-b-2 border-indigo-700 hover:bg-indigo-600">
                    <TableHead className="font-bold text-white dark:text-white text-left py-4 px-6">ID</TableHead>
                    <TableHead className="font-bold text-white dark:text-white text-left py-4 px-6">Cliente</TableHead>
                    <TableHead className="font-bold text-white dark:text-white text-left py-4 px-6">Fecha</TableHead>
                    <TableHead className="font-bold text-white dark:text-white text-left py-4 px-6">Estado</TableHead>
                    <TableHead className="font-bold text-white dark:text-white text-left py-4 px-6">Total</TableHead>
                    <TableHead className="font-bold text-white dark:text-white text-center py-4 px-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow 
                      key={order.order_id}
                      className={`
                        transition-all duration-200 border-b border-gray-200 dark:border-gray-700
                        ${index % 2 === 0 
                          ? 'bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' 
                          : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }
                      `}
                    >
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                          #{order.order_id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {order.user?.name || 'Usuario'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {order.user?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">{formatDate(order.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Banknote className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${order.order_id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Ver detalles</span>
                          <span className="sm:hidden">Ver</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls - Responsive */}
          <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Info y Selector de Límite */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center sm:text-left">
                Mostrando {orders.length} de {pagination.total} pedidos
              </p>
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <label htmlFor="limit-select" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Por página:
                </label>
                <select
                  id="limit-select"
                  value={pageLimit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Controles de Navegación - Responsive */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Botón Refrescar */}
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Refrescar"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              {/* Primera Página */}
              <Button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="p-2 hidden sm:flex"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Página Anterior */}
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              {/* Indicador de Página */}
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
                  {currentPage} <span className="text-gray-500 dark:text-gray-400">de</span> {pagination.totalPages}
                </span>
              </div>

              {/* Página Siguiente */}
              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              </Button>

              {/* Última Página */}
              <Button
                onClick={goToLastPage}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                size="sm"
                className="p-2 hidden sm:flex"
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}