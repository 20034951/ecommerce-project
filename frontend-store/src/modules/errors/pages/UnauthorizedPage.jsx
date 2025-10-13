import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">No Autorizado</h1>
      <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
    </div>
  );
}