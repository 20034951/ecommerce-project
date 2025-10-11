import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Settings,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn.js';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: Package
  },
  {
    name: 'Categorías',
    href: '/admin/categories',
    icon: FolderTree
  },
  {
    name: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    name: 'Roles',
    href: '/admin/roles',
    icon: Shield
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: Settings
  }
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-blue-700">
        <Link to="/admin/dashboard" className="text-white text-xl font-bold">
          Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive(item.href)
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}