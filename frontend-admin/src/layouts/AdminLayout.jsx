import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { AdminHeader } from '../components/layout/AdminHeader.jsx';
import { TokenDebugger } from '../components/debug/TokenDebugger.jsx';
import { useSimpleTokenManager } from '../hooks/useSimpleTokenManager.js';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext.jsx';

function AdminLayoutContent() {
  // Activar el manejo automático del token
  useSimpleTokenManager();
  const { isMinimized } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMinimized ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
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

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}