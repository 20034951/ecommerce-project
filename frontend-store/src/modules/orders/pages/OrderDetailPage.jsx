import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../../api';
import { OrderTimeline, CancelOrderModal } from '../components';
import ProfileLayout from '../../../layouts/ProfileLayout.jsx';
import { formatCurrency } from '../../../utils/currency.js';
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
      // El API retorna { success, data }
      const orderData = response.data || response;
      setOrder(orderData);
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
      <ProfileLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando detalles del pedido...</p>
        </div>
      </ProfileLayout>
    );
  };

  if (error) {
    return (
      <ProfileLayout>
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a mis pedidos
              </Button>
              <Button
                onClick={fetchOrderDetails}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
              >
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </ProfileLayout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <ProfileLayout>
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/orders"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a mis pedidos
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pedido #{order.order_id}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
                <span className="hidden sm:inline">Cancelar Pedido</span>
                <span className="sm:hidden">Cancelar</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Package className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.product?.name || 'Producto'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cantidad: <span className="font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                        </p>
                        <span className="text-gray-400 dark:text-gray-600">×</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.price)} <span className="text-xs">c/u</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Subtotal
                      </p>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <OrderTimeline
            statusHistory={order.statusHistory || []}
            currentStatus={order.status}
            estimatedDelivery={order.estimated_delivery}
          />

          {/* Cancelación */}
          {order.status === 'cancelled' && order.cancellation_reason && (
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <XCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-200">Pedido cancelado</p>
                <p className="text-sm mt-1 text-red-700 dark:text-red-300">Motivo: {order.cancellation_reason}</p>
                {order.cancelled_at && (
                  <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                    Cancelado el {formatDate(order.cancelled_at)}
                  </p>
                )}
              </div>
            </Alert>
          )}
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          {/* Resumen */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Subtotal de productos */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(
                    order.items?.reduce((sum, item) => 
                      sum + (parseFloat(item.price) * item.quantity), 0
                    ) || 0
                  )}
                </span>
              </div>

              {/* Costo de envío */}
              {order.shippingMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío ({order.shippingMethod.name}):</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(order.shippingMethod.cost)}
                  </span>
                </div>
              )}

              {/* Descuento por cupón */}
              {order.coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Descuento ({order.coupon.code}):
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    - {formatCurrency(order.coupon.discount_amount || 0)}
                  </span>
                </div>
              )}

              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3"></div>

              {/* Total */}
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>

              {/* Información adicional de envío */}
              {order.shippingMethod && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3"></div>
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Método:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {order.shippingMethod.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Región:</span>
                      <span className="text-gray-900 dark:text-white">
                        {order.shippingMethod.region}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Seguimiento */}
          {(order.tracking_number || order.tracking_url) && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.tracking_number && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Número de seguimiento:
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded flex-1 font-mono">
                        {order.tracking_number}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(order.tracking_number)}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Rastrear en sitio del proveedor
                    </a>
                  </div>
                )}

                {order.estimated_delivery && order.status !== 'delivered' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Entrega estimada:
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(order.estimated_delivery)}
                    </p>
                  </div>
                )}

                {order.status === 'delivered' && order.delivered_at && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Entregado el:
                    </label>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {formatDate(order.delivered_at)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dirección de Envío */}
          {order.address && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.address.address_line}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.city}{order.address.state ? `, ${order.address.state}` : ''}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.country}
                </p>
                {order.address.postal_code && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CP: {order.address.postal_code}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Información de Contacto */}
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

      {/* Modal de Cancelación */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderId={order.order_id}
        orderStatus={order.status}
        isLoading={isCancelling}
      />
    </ProfileLayout>
  );
}
