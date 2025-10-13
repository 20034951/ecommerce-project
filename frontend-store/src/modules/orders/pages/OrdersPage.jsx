import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from '../../../components/ui';
import { 
  ShoppingBag, 
  Eye, 
  Calendar,
  DollarSign,
  Package,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setIsLoading(true);
      // Mock orders data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders([
        {
          id: '12345',
          date: '2024-01-15',
          status: 'delivered',
          total: 89.99,
          items: 3,
          products: ['Laptop Stand', 'Wireless Mouse', 'Keyboard']
        },
        {
          id: '12344',
          date: '2024-01-10',
          status: 'shipped',
          total: 45.50,
          items: 2,
          products: ['Phone Case', 'Screen Protector']
        },
        {
          id: '12343',
          date: '2024-01-05',
          status: 'processing',
          total: 120.00,
          items: 1,
          products: ['Bluetooth Headphones']
        }
      ]);
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Procesando', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      shipped: { label: 'Enviado', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      delivered: { label: 'Entregado', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
    };

    const config = statusConfig[status] || statusConfig.processing;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (isLoading) {
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

      {/* Filters */}
      <div className="mb-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Todos
              </Button>
              <Button
                variant={filter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('processing')}
                className={filter === 'processing' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Procesando
              </Button>
              <Button
                variant={filter === 'shipped' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('shipped')}
                className={filter === 'shipped' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Enviados
              </Button>
              <Button
                variant={filter === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('delivered')}
                className={filter === 'delivered' ? 'bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}
              >
                Entregados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
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
                : `No tienes pedidos con estado "${filter}".`}
            </p>
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link to="/catalog">
                Explorar Productos
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                        Pedido #{order.id}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(order.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        {order.items} producto{order.items !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        ${order.total.toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.products.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full md:w-auto border-gray-300 dark:border-gray-600"
                    >
                      <Link to={`/orders/${order.id}`}>
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
      )}
    </div>
  );
}