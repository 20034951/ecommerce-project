import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import { authApi } from '../../../api/auth.js';

export default function ForgotPasswordPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 
        'Error al enviar el correo de recuperación. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/25' 
            : 'bg-gradient-to-br from-amber-600 to-orange-600 shadow-2xl shadow-amber-500/25'
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
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h1 className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Recuperar Contraseña
        </h1>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Ingresa tu correo electrónico para recibir instrucciones de recuperación
        </p>
      </div>

      {/* Main Content */}
      <Card className={`backdrop-blur-sm transition-all duration-300 border-0 shadow-2xl mb-6 ${
        isDarkMode 
          ? 'bg-gray-800/40 shadow-black/50' 
          : 'bg-white/85 shadow-slate-900/10'
      }`}>
        <div className="p-8">
          {success ? (
            <div className="text-center space-y-6">
              <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <svg
                  className={`h-8 w-8 transition-colors duration-300 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Correo Enviado Exitosamente
                </h3>
                <p className={`text-base transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Se han enviado instrucciones de recuperación a{' '}
                  <strong className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                    {email}
                  </strong>
                  . Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
                <div className={`mt-4 p-4 rounded-lg ${
                  isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 mt-0.5 mr-3 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className={`transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Enviar Nuevamente
                </Button>
                <Link to="/admin/login">
                  <Button variant="ghost" className={`w-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 transition-all duration-300 border-0 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70 focus:ring-amber-400' 
                        : 'bg-slate-50/80 text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-amber-600 focus:ring-2'
                    } backdrop-blur-sm`}
                    placeholder="admin@ejemplo.com"
                    disabled={isSubmitting}
                  />
                </div>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Ingresa el correo electrónico asociado a tu cuenta de administrador
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-300 transform ${
                    isSubmitting ? 'scale-95' : 'hover:scale-105'
                  } ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40' 
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                  }`}
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="sm" className="mr-3" />
                      <span>Enviando correo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Instrucciones
                    </div>
                  )}
                </Button>

                <Link to="/admin/login">
                  <Button variant="ghost" className={`w-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al Login
                  </Button>
                </Link>
              </div>
            </form>
          )}
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