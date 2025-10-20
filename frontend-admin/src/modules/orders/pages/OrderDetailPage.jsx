import React, { useState } from 'react';
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
  DollarSign,
  Coins,
  ExternalLink
} from 'lucide-react';
import { UpdateOrderStatusForm, OrderTimeline } from '../components';
import { useOrder } from '../../../hooks/useOrder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../../api/ordersApi';

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
  const queryClient = useQueryClient();
  
  // Usar el hook useOrder para obtener los datos
  const { data: order, isLoading, error } = useOrder(id);

  // Mutation para actualizar el estado del pedido
  const updateStatusMutation = useMutation({  
    mutationFn: (statusData) => ordersApi.updateOrderStatus(id, statusData),
    onSuccess: () => {
      // Invalidar las queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error) => {
      console.error('Error al actualizar estado:', error);
    }
  });

  const handleUpdateStatus = async (statusData) => {
    try {
      await updateStatusMutation.mutateAsync(statusData);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar el estado');
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
    return `Q. ${parseFloat(amount).toLocaleString('es-GT', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
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
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error?.message || 'No se pudo cargar el pedido'}
            </p>
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
  
  if (!order) {
    return null;
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
            <CardHeader className="bg-emerald-100 dark:bg-emerald-900/50 border-b border-emerald-200 dark:border-emerald-800">
              <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg mr-2">
                  <Package className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                </div>
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {order?.items ? (
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const subtotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.order_item_id}
                        className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {item.product?.name || 'Producto'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            SKU: {item.product?.sku || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cantidad: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subtotal</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(subtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Total de productos */}
                  <div className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Total de Productos
                      </span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(
                          order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay información de productos disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {(order.tracking_number || order.tracking_url || order.estimated_delivery) && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-blue-100 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800">
                <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                  <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg mr-2">
                    <Truck className="h-5 w-5 text-blue-700 dark:text-blue-200" />
                  </div>
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {order.tracking_number && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Número de Seguimiento
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-mono">
                      {order.tracking_number}
                    </p>
                  </div>
                )}
                {order.tracking_url && (
                  <div>
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Rastrear envío
                    </a>
                  </div>
                )}
                {order.estimated_delivery && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Fecha Estimada de Entrega
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(order.estimated_delivery).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status History with OrderTimeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-purple-100 dark:bg-purple-900/50 border-b border-purple-200 dark:border-purple-800">
                <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center">
                  <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg mr-2">
                    <Clock className="h-5 w-5 text-purple-700 dark:text-purple-200" />
                  </div>
                  Historial de Estados
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <OrderTimeline history={order.statusHistory} />
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
          <UpdateOrderStatusForm
            orderId={order.order_id}
            currentStatus={order.status}
            onSubmit={handleUpdateStatus}
            isLoading={updateStatusMutation.isPending}
          />

          {/* Order Summary */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-amber-100 dark:bg-amber-900/50 border-b border-amber-200 dark:border-amber-800">
              <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center">
                <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg mr-2">
                  <Coins className="h-5 w-5 text-amber-700 dark:text-amber-200" />
                </div>
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Total:</span>
                <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                  {order ? formatCurrency(order.total_amount) : '$0.00'}
                </span>
              </div>
              {order?.shippingMethod && (
                <div className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Método de envío:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {order.shippingMethod.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order?.user && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-indigo-100 dark:bg-indigo-900/50 border-b border-indigo-200 dark:border-indigo-800">
                <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center">
                  <div className="p-2 bg-indigo-200 dark:bg-indigo-800 rounded-lg mr-2">
                    <User className="h-5 w-5 text-indigo-700 dark:text-indigo-200" />
                  </div>
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {order.user.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <a
                    href={`mailto:${order.user.email}`}
                    className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 font-medium"
                  >
                    {order.user.email}
                  </a>
                </div>
                {order.user.phone && (
                  <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <a
                      href={`tel:${order.user.phone}`}
                      className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 font-medium"
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
              <CardHeader className="bg-rose-100 dark:bg-rose-900/50 border-b border-rose-200 dark:border-rose-800">
                <CardTitle className="text-rose-900 dark:text-rose-100 flex items-center">
                  <div className="p-2 bg-rose-200 dark:bg-rose-800 rounded-lg mr-2">
                    <MapPin className="h-5 w-5 text-rose-700 dark:text-rose-200" />
                  </div>
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.address.address_line}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {order.address.city}, {order.address.state || ''}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {order.address.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}