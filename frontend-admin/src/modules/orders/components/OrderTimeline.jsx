import React from 'react';
import { Clock, Package, CreditCard, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/ui';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-200 dark:bg-slate-700',
    borderColor: 'border-slate-400 dark:border-slate-600'
  },
  paid: {
    label: 'Pagado',
    icon: CreditCard,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-200 dark:bg-blue-800',
    borderColor: 'border-blue-500 dark:border-blue-600'
  },
  processing: {
    label: 'Procesando',
    icon: Package,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-200 dark:bg-amber-800',
    borderColor: 'border-amber-500 dark:border-amber-600'
  },
  shipped: {
    label: 'Enviado',
    icon: Truck,
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-200 dark:bg-indigo-800',
    borderColor: 'border-indigo-500 dark:border-indigo-600'
  },
  delivered: {
    label: 'Entregado',
    icon: CheckCircle,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-200 dark:bg-emerald-800',
    borderColor: 'border-emerald-500 dark:border-emerald-600'
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-200 dark:bg-red-800',
    borderColor: 'border-red-500 dark:border-red-600'
  }
};

export function OrderTimeline({ history = [] }) {
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

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700">
        <AlertCircle className="h-12 w-12 mb-3 text-purple-400 dark:text-purple-500" />
        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">No hay historial de seguimiento disponible</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-purple-300 dark:bg-purple-700 rounded-full" />

      {/* Items del timeline */}
      <div className="space-y-8">
        {history.map((item, index) => {
          const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
          const Icon = config.icon;
          const { date, time } = formatDate(item.created_at);
          const isLast = index === history.length - 1;

          return (
            <div key={item.id || index} className="relative flex gap-6">
              {/* Icono del estado */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center ring-4 ring-white dark:ring-purple-950 shadow-lg border-2 ${config.borderColor}`}>
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>

              {/* Contenido */}
              <div className={`flex-1 pb-8 ${!isLast ? 'border-b-2 border-purple-200 dark:border-purple-800' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-100">
                      {config.label}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-0.5 font-medium">
                      {date} • {time}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${config.borderColor} ${config.color} bg-white dark:bg-purple-900/30 border-2 font-semibold`}
                  >
                    {config.label}
                  </Badge>
                </div>

                {/* Notas */}
                {item.notes && (
                  <div className="mt-3 p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                      {item.notes}
                    </p>
                  </div>
                )}

                {/* Tracking info */}
                {item.tracking_number && (
                  <div className="mt-3 flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Tracking:
                    </span>
                    <code className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-blue-900 dark:text-blue-100 font-mono font-semibold">
                      {item.tracking_number}
                    </code>
                  </div>
                )}

                {/* URL de tracking */}
                {item.tracking_url && (
                  <div className="mt-2">
                    <a
                      href={item.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline"
                    >
                      Ver seguimiento en línea →
                    </a>
                  </div>
                )}

                {/* Fecha estimada de entrega */}
                {item.estimated_delivery && (
                  <div className="mt-2 flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                      Entrega estimada: {formatDate(item.estimated_delivery).date}
                    </span>
                  </div>
                )}

                {/* Usuario que hizo el cambio */}
                {item.changed_by_user && (
                  <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded inline-block">
                    Actualizado por: {item.changed_by_user.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
