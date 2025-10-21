import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Mail,
  ShoppingBag,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 animate-bounce">
            <CheckCircle className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            ¡Pedido Confirmado! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Gracias por tu compra
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg mb-6">
          {/* Número de orden */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Tu número de orden es:
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <p className="text-2xl sm:text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400 text-center tracking-wide">
                {orderNumber}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
              Guarda este número para rastrear tu pedido
            </p>
          </div>

          {/* Información importante */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Correo de Confirmación
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Hemos enviado un correo electrónico con los detalles de tu pedido, el número de orden, subtotal, total y artículos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  ¿Qué sigue?
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Procesaremos tu pedido en las próximas 24 horas y te notificaremos cuando sea enviado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Rastreo del Pedido
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Podrás seguir el estado de tu pedido desde "Mis Pedidos" en cualquier momento.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
            >
              <Package className="h-5 w-5" />
              Ver Mis Pedidos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/catalog"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200"
            >
              <ShoppingBag className="h-5 w-5" />
              Seguir Comprando
            </Link>
          </div>
        </div>

        {/* Mensaje adicional */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Si tienes alguna pregunta sobre tu pedido, no dudes en{' '}
          <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            contactarnos
          </Link>
        </p>
      </div>
    </div>
  );
}
