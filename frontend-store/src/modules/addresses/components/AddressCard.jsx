import React from 'react';
import { Card, CardContent } from '../../../components/ui';
import { MapPin, Edit2, Trash2, Building2, Globe } from 'lucide-react';

export default function AddressCard({ address, onEdit, onDelete }) {
  const typeConfig = {
    shipping: {
      label: 'Envío',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    },
    billing: {
      label: 'Facturación',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    }
  };

  const config = typeConfig[address.type] || typeConfig.shipping;

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md group">
      <CardContent className="p-4 sm:p-5">
        {/* Header con tipo y acciones */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Building2 className="h-3 w-3 mr-1" />
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(address)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Editar dirección"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(address)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Eliminar dirección"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2 text-sm">
          <p className="text-gray-900 dark:text-white font-medium">
            {address.address_line}
          </p>
          <div className="flex flex-wrap gap-x-2 text-gray-600 dark:text-gray-400">
            <span>{address.city}</span>
            {address.state && (
              <>
                <span>•</span>
                <span>{address.state}</span>
              </>
            )}
            {address.postal_code && (
              <>
                <span>•</span>
                <span>{address.postal_code}</span>
              </>
            )}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            <span>{address.country}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
