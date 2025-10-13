import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthProvider.jsx';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(formData);
      // Redirect will happen automatically due to auth state change
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <Spinner size="xl" className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className={`absolute inset-0 rounded-full ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
            } animate-ping`} />
          </div>
          <p className={`mt-6 text-lg font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Theme Toggle Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/60 hover:bg-gray-700/60 text-yellow-400 hover:text-yellow-300 border border-gray-700 hover:border-gray-600' 
              : 'bg-white/80 hover:bg-white/90 text-slate-700 hover:text-slate-900 border border-gray-300 hover:border-gray-400 shadow-lg'
          } backdrop-blur-sm`}
          aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/25'
        }`}>
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h1 className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Panel de Administración
        </h1>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Accede a tu cuenta de administrador
        </p>
      </div>

      {/* Login Form */}
      <Card className={`backdrop-blur-sm transition-all duration-300 border-0 shadow-2xl mb-6 ${
        isDarkMode 
          ? 'bg-gray-800/40 shadow-black/50' 
          : 'bg-white/85 shadow-slate-900/10'
      }`}>
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert 
                variant="destructive" 
                className={`border-0 ${
                  isDarkMode 
                    ? 'bg-red-900/30 text-red-300 backdrop-blur-sm' 
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-slate-700'
                  }`}
              >
                Correo electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                    className={`pl-10 transition-all duration-300 border-0 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70 focus:ring-blue-400' 
                        : 'bg-slate-50/80 text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-blue-600 focus:ring-2'
                    } backdrop-blur-sm`}
                  placeholder="admin@ejemplo.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                    className={`pl-10 pr-10 transition-all duration-300 border-0 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70 focus:ring-blue-400' 
                        : 'bg-slate-50/80 text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-blue-600 focus:ring-2'
                    } backdrop-blur-sm`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                    className={`h-4 w-4 rounded border transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-400 focus:ring-offset-gray-800' 
                        : 'bg-white border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-white'
                    }`}
                />
                <label 
                  htmlFor="remember-me" 
                    className={`ml-2 block text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/admin/forgot-password"
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-700 hover:text-blue-800'
                    }`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-300 transform ${
                  isSubmitting ? 'scale-95' : 'hover:scale-105'
                } ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-3" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-slate-500'
        }`}>
          © 2024 Ecommerce Admin. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}