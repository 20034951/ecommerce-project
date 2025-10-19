import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Alert
} from '../../../components/ui';
import {
  ArrowLeft,
  Calendar,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { UpdateOrderStatusForm } from '../components';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: Clock
  },
  paid: {
    label: 'Pagado',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CreditCard
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Reemplazar con llamada API real cuando esté disponible
      // const response = await ordersApi.getOrderById(id);
      // setOrder(response.data);
      console.log('Fetching order:', id);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.error || 'Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      setIsUpdating(true);
      // TODO: Reemplazar con llamada API real cuando esté disponible
      // await ordersApi.updateOrderStatus(id, statusData);
      console.log('Updating order status:', statusData);
      await fetchOrderDetails();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error al cargar el pedido
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la lista
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center mb-4">
          <Link
            to="/admin/orders"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a pedidos
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pedido #{order?.order_id || id}
            </h1>
            {order && (
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Creado el {formatDate(order.created_at)}
              </p>
            )}
          </div>
          {order && getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              {order?.items ? (
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.order_item_id}
                      className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.product?.name || 'Producto'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {item.product?.sku || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">c/u</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay información de productos disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          {order?.statusHistory && order.statusHistory.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Historial de Estados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={history.id || index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          {getStatusBadge(history.status).props.children[0]}
                        </div>
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          {getStatusBadge(history.status)}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(history.created_at)}
                          </span>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {history.notes}
                          </p>
                        )}
                        {history.changed_by && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Por: {history.changed_by}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancellation Info */}
          {order?.status === 'cancelled' && order.cancellation_reason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">Pedido cancelado</p>
                <p className="text-sm mt-1">Motivo: {order.cancellation_reason}</p>
              </div>
            </Alert>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status Form */}
          {order && (
            <UpdateOrderStatusForm
              orderId={order.order_id}
              currentStatus={order.status}
              onSubmit={handleUpdateStatus}
              isLoading={isUpdating}
            />
          )}

          {/* Order Summary */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {order ? formatCurrency(order.total_amount) : '$0.00'}
                </span>
              </div>
              {order?.shippingMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Método de envío:</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shippingMethod.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order?.user && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.user.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${order.user.email}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    {order.user.email}
                  </a>
                </div>
                {order.user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${order.user.phone}`}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {order.user.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {order?.address && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  {order.address.address_line}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.city}, {order.address.state || ''}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.country}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}