import React, { Suspense, lazy } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout.jsx';

const SimpleAdminError = lazy(() => import('../../modules/errors/pages/SimpleAdminError.jsx'));

function AdminErrorElement() {
  return (
    <AdminLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando página de error...</p>
          </div>
        </div>
      }>
        <SimpleAdminError />
      </Suspense>
    </AdminLayout>
  );
}

export default AdminErrorElement;