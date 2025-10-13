import {
  ChevronDown,
  LogOut,
  Search,
  ShoppingCart,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { useSidebar } from '../../contexts/SidebarContext.jsx';
import { ThemeToggle } from '../theme/ThemeToggle.jsx';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const { isMinimized, toggleMinimized } = useSidebar();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prev => !prev);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Cerrar dropdown al hacer click fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 h-20 flex items-center justify-between px-8 transition-all duration-200">
      {/* Left Section - Toggle Sidebar (solo desktop) */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={toggleMinimized}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          title={isMinimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
        >
          {isMinimized ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-8">
        {/* Desktop Search 
        <div className="hidden md:block relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Buscar productos, usuarios, pedidos..."
            className="w-full pl-12 pr-6 py-3 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          />
        </div>*/}

        {/* Mobile Search */}
        <div className="md:hidden relative">
          {!isSearchOpen ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <Search className="h-6 w-6" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <div className="border-l border-gray-100 dark:border-gray-800 pl-4">
          <ThemeToggle />
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleUserDropdown}
            onMouseEnter={() => window.innerWidth >= 1024 && setIsUserDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth >= 1024 && setIsUserDropdownOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@ecommerce.com'}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <div 
            className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 transition-all duration-200 z-50 ${
              isUserDropdownOpen 
                ? 'opacity-100 visible transform translate-y-0' 
                : 'opacity-0 invisible transform translate-y-2'
            }`}
            onMouseEnter={() => window.innerWidth >= 1024 && setIsUserDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth >= 1024 && setIsUserDropdownOpen(false)}
          >
            {/* User Info Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@ecommerce.com'}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 mt-1">
                    Administrador
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-2">
              <button 
                onClick={() => {
                  handleLogout();
                  closeUserDropdown();
                }}
                className="w-full text-left px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}