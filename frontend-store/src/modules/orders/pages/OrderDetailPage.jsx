import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from '../../../components/ui';
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchOrder = async () => {
      setIsLoading(true);
      // Mock order data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrder({
        id: id,
        date: '2024-01-15',
        status: 'delivered',
        total: 89.99,
        subtotal: 79.99,
        shipping: 10.00,
        tax: 0.00,
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17',
        shippingAddress: {
          name: 'Juan Pérez',
          address: 'Calle Falsa 123',
          city: 'Buenos Aires',
          state: 'CABA',
          zipCode: '1234',
          country: 'Argentina',
          phone: '+54 11 1234-5678'
        },
        items: [
          {
            id: 1,
            name: 'Laptop Stand Adjustable',
            price: 29.99,
            quantity: 1,
            image: '/api/placeholder/80/80'
          },
          {
            id: 2,
            name: 'Wireless Mouse Gaming',
            price: 35.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          },
          {
            id: 3,
            name: 'Mechanical Keyboard',
            price: 15.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          }
        ],
        timeline: [
          { status: 'ordered', date: '2024-01-15', title: 'Pedido realizado', description: 'Tu pedido ha sido confirmado' },
          { status: 'processing', date: '2024-01-15', title: 'En preparación', description: 'Estamos preparando tu pedido' },
          { status: 'shipped', date: '2024-01-16', title: 'Enviado', description: 'Tu pedido está en camino' },
          { status: 'delivered', date: '2024-01-17', title: 'Entregado', description: 'Pedido entregado exitosamente' }
        ]
      });
      setIsLoading(false);
    };

    fetchOrder();
  }, [id]);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Pedido no encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No pudimos encontrar el pedido #{id}
            </p>
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link to="/orders">
                Volver a mis pedidos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pedido #{order.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Realizado el {new Date(order.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.status === 'delivered' 
                        ? 'bg-green-500' 
                        : event.status === 'shipped' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                <span className="text-gray-900 dark:text-white">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                <span className="text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Número de seguimiento:</label>
                  <div className="flex items-center mt-1">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1">
                      {order.trackingNumber}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(order.trackingNumber)}
                      className="ml-2"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {order.status === 'delivered' && order.actualDelivery && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Entregado el:</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(order.actualDelivery).toLocaleDateString('es-ES', {
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

          {/* Shipping Address */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">
                {order.shippingAddress.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.country}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {order.shippingAddress.phone}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}