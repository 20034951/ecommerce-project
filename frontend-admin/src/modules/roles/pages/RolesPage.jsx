import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
        <p className="mt-2 text-gray-600">
          Gestiona los roles y permisos del sistema
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Módulo de Roles
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </Card>
    </div>
  );
}