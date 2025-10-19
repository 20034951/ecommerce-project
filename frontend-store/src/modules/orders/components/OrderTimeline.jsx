import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../components/ui';
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500',
    label: 'Pendiente'
  },
  paid: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    label: 'Pagado'
  },
  processing: {
    icon: Package,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    label: 'Procesando'
  },
  shipped: {
    icon: Truck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    label: 'Enviado'
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    label: 'Entregado'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    label: 'Cancelado'
  }
};

export default function OrderTimeline({ statusHistory, currentStatus, estimatedDelivery }) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Estado del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay historial de estados disponible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Estado del Pedido</CardTitle>
        {estimatedDelivery && currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Entrega estimada: {formatDate(estimatedDelivery).date}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {statusHistory.map((event, index) => {
              const config = STATUS_CONFIG[event.status] || STATUS_CONFIG.pending;
              const Icon = config.icon;
              const isLast = index === statusHistory.length - 1;
              const { date, time } = formatDate(event.created_at);

              return (
                <div key={event.history_id || index} className="relative flex items-start gap-4">
                  {/* Icon Circle */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${config.bgColor} flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {config.label}
                        </h4>
                        {event.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {event.notes}
                          </p>
                        )}
                        {event.user && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Por: {event.user.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {date}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
