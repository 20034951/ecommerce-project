import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  Heart,
  LogOut
} from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../auth/AuthProvider.jsx';
import { AuthGuard } from '../../auth/Guards.jsx';
import { useCart } from '../../modules/cart/hooks/useCart.js';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Store</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/catalog" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Catálogo
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Categorías
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Acerca de
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Buscar productos..."
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <AuthGuard fallback={null}>
              <Link 
                to="/wishlist" 
                className="text-gray-700 hover:text-primary-600 p-2 transition-colors relative"
              >
                <Heart className="h-6 w-6" />
              </Link>
            </AuthGuard>

            {/* Shopping Cart */}
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-primary-600 p-2 transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <AuthGuard 
              fallback={
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </Button>
                </div>
              }
            >
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-primary-600 p-2 transition-colors">
                  <User className="h-6 w-6" />
                </button>
                
                {/* User Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm text-gray-700 font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mis Pedidos
                    </Link>
                    <Link 
                      to="/addresses" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Direcciones
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </AuthGuard>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Search Bar Mobile */}
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Buscar productos..."
                />
              </div>

              <Link 
                to="/catalog" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link 
                to="/categories" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>

              <AuthGuard fallback={
                <div className="pt-4 pb-3 border-t border-gray-100">
                  <div className="flex flex-col space-y-2 px-3">
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button 
                      className="justify-start"
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                    >
                      Registrarse
                    </Button>
                  </div>
                </div>
              }>
                <div className="pt-4 pb-3 border-t border-gray-100">
                  <div className="px-3 mb-3">
                    <p className="text-base font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Link 
                      to="/profile" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <Link 
                      to="/addresses" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Direcciones
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </AuthGuard>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}