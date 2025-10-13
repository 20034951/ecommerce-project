import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';

export default function UserDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Usuario</h1>
        <p className="mt-2 text-gray-600">
          Ver y editar información del usuario
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Detalle de Usuario
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </Card>
    </div>
  );
}