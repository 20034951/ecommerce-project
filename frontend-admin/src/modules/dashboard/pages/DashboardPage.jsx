import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Bienvenido al panel de control principal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Total Usuarios</h3>
          <p className="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Productos</h3>
          <p className="text-2xl font-bold text-green-600">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Ventas</h3>
          <p className="text-2xl font-bold text-yellow-600">$89,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600">Pedidos</h3>
          <p className="text-2xl font-bold text-red-600">456</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Dashboard funcionando correctamente</h2>
        <p className="text-gray-600">
          Los componentes y estilos se están cargando sin errores.
        </p>
      </div>
    </div>
  );
}
