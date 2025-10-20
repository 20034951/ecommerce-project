import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui';
import { 
  User, 
  Shield,
  ShoppingBag, 
  MapPin, 
  Heart,
  Camera
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider.jsx';

/**
 * Layout para todas las páginas del perfil de usuario
 * Incluye sidebar con navegación y área de contenido
 */
export default function ProfileLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      to: '/profile',
      icon: User,
      label: 'Información Personal',
      exact: true
    },
    {
      to: '/profile/security',
      icon: Shield,
      label: 'Seguridad'
    },
    {
      to: '/orders',
      icon: ShoppingBag,
      label: 'Mis Pedidos'
    },
    {
      to: '/addresses',
      icon: MapPin,
      label: 'Direcciones'
    },
    {
      to: '/wishlist',
      icon: Heart,
      label: 'Lista de Deseos'
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 lg:sticky lg:top-4">
              <CardContent className="p-4 sm:p-6">
                {/* User Avatar */}
                <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative inline-block mb-3">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-indigo-50 dark:ring-indigo-900/30">
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <button 
                      className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors shadow-md ring-2 ring-white dark:ring-gray-800"
                      title="Cambiar foto"
                    >
                      <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-1">
                    {user?.name || 'Usuario'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate px-2">
                    {user?.email}
                  </p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`
                          group flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left rounded-lg font-medium transition-all duration-200
                          ${active 
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                          }
                        `}
                      >
                        <div className={`
                          flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg mr-3 flex-shrink-0 transition-colors
                          ${active 
                            ? 'bg-indigo-100 dark:bg-indigo-500/20' 
                            : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                          }
                        `}>
                          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                        </div>
                        <span className="truncate text-sm sm:text-base">{item.label}</span>
                        {active && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
