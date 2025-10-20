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
  X,
  Bug,
  ChevronRight,
  Truck
} from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { useSidebar } from '../../contexts/SidebarContext.jsx';

/**
 * Sidebar moderno con diseño actualizado y soporte completo para modo oscuro
 */

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Panel principal'
  },
  {
    name: 'Usuarios',
    href: '/admin/users',
    icon: Users,
    description: 'Gestión de usuarios'
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: Package,
    description: 'Catálogo de productos'
  },
  {
    name: 'Categorías',
    href: '/admin/categories',
    icon: FolderTree,
    description: 'Organización de productos'
  },
  {
    name: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Gestión de pedidos'
  },
  {
    name: 'Métodos de Envío',
    href: '/admin/shipping-methods',
    icon: Truck,
    description: 'Opciones de entrega'
  },
  {
    name: 'Roles',
    href: '/admin/roles',
    icon: Shield,
    description: 'Control de acceso'
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
    description: 'Ajustes del sistema'
  }
];

export function Sidebar() {
  const { isMinimized, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useSidebar();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Componente para el popover en modo minimizado
  const NavItemPopover = ({ item, children }) => {
    if (!isMinimized) return children;

    return (
      <div className="relative group">
        {children}
        <div className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
          <div className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center border-b border-gray-100 dark:border-gray-800 transition-all duration-300",
        isMinimized ? "justify-center px-4 py-6" : "justify-center px-6 py-8"
      )}>
        <Link 
          to="/admin/dashboard" 
          className="group flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          {!isMinimized && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Ecommerce
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-6 space-y-2 overflow-y-auto transition-all duration-300",
        isMinimized ? "px-2" : "px-4"
      )}>
        {!isMinimized && (
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-4">
            Navegación
          </div>
        )}
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <NavItemPopover key={item.name} item={item}>
              <Link
                to={item.href}
                className={cn(
                  'group relative flex items-center text-sm font-medium rounded-xl transition-all duration-200 ease-in-out',
                  isMinimized ? 'justify-center p-3' : 'px-3 py-3',
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white hover:transform hover:scale-[1.01]'
                )}
                onClick={closeMobileMenu}
                title={isMinimized ? item.name : undefined}
              >
                {/* Active indicator para modo expandido */}
                {active && !isMinimized && (
                  <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                <div className={cn(
                  'flex items-center justify-center rounded-lg transition-colors',
                  isMinimized ? 'w-8 h-8' : 'w-8 h-8 mr-3',
                  active
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                )}>
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      active
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    )}
                  />
                </div>
                
                {!isMinimized && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'text-sm font-medium truncate',
                        active ? 'text-white' : ''
                      )}>
                        {item.name}
                      </div>
                      <div className={cn(
                        'text-xs opacity-75 truncate',
                        active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      )}>
                        {item.description}
                      </div>
                    </div>
                    
                    {active && (
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    )}
                  </>
                )}
              </Link>
            </NavItemPopover>
          );
        })}
      </nav>

      {/* Footer */}
      {!isMinimized && (
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Panel Administrativo
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300",
        isMinimized ? "lg:w-20" : "lg:w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out lg:hidden">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}