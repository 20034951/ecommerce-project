import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../../api';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Alert
} from '../../../components/ui';
import { 
  ShoppingBag, 
  Eye, 
  Calendar,
  DollarSign,
  Package,
  ArrowLeft,
  Filter,
  Search,
  AlertCircle,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { 
    label: 'Pendiente', 
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: Clock
  },
  paid: { 
    label: 'Pagado', 
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle
  },
  processing: { 
    label: 'Procesando', 
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: Package
  },
  shipped: { 
    label: 'Enviado', 
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: Truck
  },
  delivered: { 
    label: 'Entregado', 
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle
  },
  cancelled: { 
    label: 'Cancelado', 
    className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: XCircle
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter, currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ordersApi.getMyOrders({
        status: filter,
        page: currentPage,
        limit: 10,
        search: searchTerm
      });

      setOrders(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.error || 'Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            to="/profile"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al perfil
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Pedidos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Revisa el estado y detalles de tus pedidos
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por número de pedido o tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por estado:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('all'); setCurrentPage(1); }}
                className={filter === 'all' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Todos
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('pending'); setCurrentPage(1); }}
                className={filter === 'pending' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Pendientes
              </Button>
              <Button
                variant={filter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('processing'); setCurrentPage(1); }}
                className={filter === 'processing' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Procesando
              </Button>
              <Button
                variant={filter === 'shipped' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('shipped'); setCurrentPage(1); }}
                className={filter === 'shipped' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Enviados
              </Button>
              <Button
                variant={filter === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('delivered'); setCurrentPage(1); }}
                className={filter === 'delivered' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Entregados
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter('cancelled'); setCurrentPage(1); }}
                className={filter === 'cancelled' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Cancelados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Aún no has realizado ningún pedido.' 
                : `No tienes pedidos con estado "${STATUS_CONFIG[filter]?.label || filter}".`}
            </p>
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link to="/catalog">
                Explorar Productos
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card 
                key={order.order_id} 
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2 gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Pedido #{order.order_id}
                        </h3>
                        {getStatusBadge(order.status)}
                        {order.tracking_number && (
                          <Badge variant="outline" className="text-xs">
                            {order.tracking_number}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          {order.items?.length || 0} producto{order.items?.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </div>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.slice(0, 3).map(item => item.product?.name || 'Producto').join(', ')}
                            {order.items.length > 3 && `... y ${order.items.length - 3} más`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full md:w-auto border-gray-300 dark:border-gray-600"
                      >
                        <Link to={`/orders/${order.order_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="border-gray-300 dark:border-gray-600"
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? 'bg-primary-600 text-white' 
                      : 'border-gray-300 dark:border-gray-600'}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="border-gray-300 dark:border-gray-600"
              >
                Siguiente
              </Button>
            </div>
          )}

          {/* Results Info */}
          {pagination && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Mostrando {orders.length} de {pagination.total} pedidos
            </div>
          )}
        </>
      )}
    </div>
  );
}