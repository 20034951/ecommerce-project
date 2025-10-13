import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Producto</h1>
        <p className="mt-2 text-gray-600">
          Agregar un nuevo producto al catálogo
        </p>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Crear Producto
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </Card>
    </div>
  );
}