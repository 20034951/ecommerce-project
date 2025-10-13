import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { AdminHeader } from '../components/layout/AdminHeader.jsx';
import { TokenDebugger } from '../components/debug/TokenDebugger.jsx';
import { useSimpleTokenManager } from '../hooks/useSimpleTokenManager.js';

export function AdminLayout() {
  // Activar el manejo automático del token
  useSimpleTokenManager();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Token Debugger (solo en desarrollo) */}
      <TokenDebugger />
    </div>
  );
}