import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../../api';
import { OrderTimeline, CancelOrderModal } from '../components';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Alert
} from '../../../components/ui';
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Package,
  Truck,
  MapPin,
  Phone,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  CreditCard
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
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ordersApi.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.error || 'Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (reason) => {
    try {
      setIsCancelling(true);
      await ordersApi.cancelOrder(id, reason);
      await fetchOrderDetails();
      setShowCancelModal(false);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Error al cancelar el pedido');
    } finally {
      setIsCancelling(false);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canBeCancelled = order && ['pending', 'paid', 'processing'].includes(order.status);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error al cargar el pedido
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/orders')}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                Volver a mis pedidos
              </Button>
              <Button
                onClick={fetchOrderDetails}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            to="/orders"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis pedidos
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pedido #{order.order_id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Realizado el {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            {canBeCancelled && (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Pedido
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
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
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <OrderTimeline
            statusHistory={order.statusHistory || []}
            currentStatus={order.status}
            estimatedDelivery={order.estimated_delivery}
          />

          {order.status === 'cancelled' && order.cancellation_reason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">Pedido cancelado</p>
                <p className="text-sm mt-1">Motivo: {order.cancellation_reason}</p>
                {order.cancelled_at && (
                  <p className="text-xs mt-1">
                    Cancelado el {formatDate(order.cancelled_at)}
                  </p>
                )}
              </div>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
              {order.shippingMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Método de envío:</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.shippingMethod.name}
                  </span>
                </div>
              )}
              {order.coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cupón aplicado:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {order.coupon.code}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {(order.tracking_number || order.tracking_url) && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.tracking_number && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Número de seguimiento:
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                        {order.tracking_number}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(order.tracking_number)}
                        className="ml-2"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                {order.tracking_url && (
                  <div>
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Rastrear en sitio del proveedor
                    </a>
                  </div>
                )}

                {order.estimated_delivery && order.status !== 'delivered' && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Entrega estimada:
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(order.estimated_delivery)}
                    </p>
                  </div>
                )}

                {order.status === 'delivered' && order.delivered_at && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Entregado el:
                    </label>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatDate(order.delivered_at)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {order.address && (
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

          {order.user && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.user.email}
                </p>
                {order.user.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {order.user.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={order.order_id}
        orderStatus={order.status}
        isLoading={isCancelling}
      />
    </div>
  );
}
