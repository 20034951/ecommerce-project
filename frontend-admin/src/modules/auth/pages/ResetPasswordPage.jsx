import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import { authApi } from '../../../api/auth.js';

export default function ResetPasswordPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación inválido o expirado.');
    }
  }, [token]);

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = (password) => {
      if (!password) {
        setPasswordStrength({ score: 0, feedback: '' });
        return;
      }

      let score = 0;
      let feedback = [];

      if (password.length >= 8) score++;
      else feedback.push('Al menos 8 caracteres');

      if (/[a-z]/.test(password)) score++;
      else feedback.push('Una letra minúscula');

      if (/[A-Z]/.test(password)) score++;
      else feedback.push('Una letra mayúscula');

      if (/\d/.test(password)) score++;
      else feedback.push('Un número');

      if (/[^A-Za-z0-9]/.test(password)) score++;
      else feedback.push('Un carácter especial');

      const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
      const strengthLabel = strengthLabels[score] || 'Muy débil';

      setPasswordStrength({
        score,
        feedback: feedback.length > 0 ? `Necesita: ${feedback.join(', ')}` : `Contraseña ${strengthLabel}`
      });
    };

    checkPasswordStrength(formData.password);
  }, [formData.password]);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 3) {
      setError('La contraseña debe ser más segura. Incluye mayúsculas, minúsculas, números y caracteres especiales.');
      setIsSubmitting(false);
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Error al restablecer la contraseña. El token puede haber expirado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if no token
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return isDarkMode ? 'text-red-400' : 'text-red-600';
    if (passwordStrength.score <= 2) return isDarkMode ? 'text-orange-400' : 'text-orange-600';
    if (passwordStrength.score <= 3) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-green-400' : 'text-green-600';
  };

  const getPasswordStrengthBg = () => {
    if (passwordStrength.score <= 1) return isDarkMode ? 'bg-red-900/20' : 'bg-red-50';
    if (passwordStrength.score <= 2) return isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50';
    if (passwordStrength.score <= 3) return isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50';
    return isDarkMode ? 'bg-green-900/20' : 'bg-green-50';
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
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/25' 
            : 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-2xl shadow-emerald-500/25'
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
          Nueva Contraseña
        </h1>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-slate-600'
        }`}>
          Crea una nueva contraseña segura para tu cuenta.
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
                  Contraseña Actualizada Exitosamente
                </h3>
                <p className={`text-base transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Tu contraseña ha sido actualizada exitosamente. 
                  Ahora puedes iniciar sesión con tu nueva contraseña.
                </p>
                <div className={`mt-4 p-4 rounded-lg ${
                  isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 mt-0.5 mr-3 ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                    }`}>
                      Tu cuenta está ahora protegida con una nueva contraseña segura.
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/admin/login">
                <Button className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                }`}>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Ir al Login
                </Button>
              </Link>
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
                  htmlFor="password" 
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-slate-700'
                  }`}
                >
                  Nueva Contraseña
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 transition-all duration-300 border-0 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70 focus:ring-emerald-400' 
                        : 'bg-slate-50/80 text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-emerald-600 focus:ring-2'
                    } backdrop-blur-sm`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    minLength={8}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className={`mt-2 p-3 rounded-lg transition-all duration-300 ${getPasswordStrengthBg()}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                        Seguridad de la contraseña
                      </span>
                      <span className={`text-xs ${getPasswordStrengthColor()}`}>
                        {Math.round((passwordStrength.score / 5) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 1 ? 'bg-red-500' :
                          passwordStrength.score <= 2 ? 'bg-orange-500' :
                          passwordStrength.score <= 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${getPasswordStrengthColor()}`}>
                      {passwordStrength.feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="confirmPassword" 
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-slate-700'
                  }`}
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 transition-all duration-300 border-0 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/70 focus:ring-emerald-400' 
                        : 'bg-slate-50/80 text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-emerald-600 focus:ring-2'
                    } backdrop-blur-sm`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {showConfirmPassword ? (
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

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`flex items-center mt-2 ${
                    formData.password === formData.confirmPassword 
                      ? isDarkMode ? 'text-green-400' : 'text-green-600'
                      : isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-sm">
                      {formData.password === formData.confirmPassword 
                        ? 'Las contraseñas coinciden' 
                        : 'Las contraseñas no coinciden'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-300 transform ${
                    isSubmitting ? 'scale-95' : 'hover:scale-105'
                  } ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                  }`}
                  disabled={isSubmitting || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword || passwordStrength.score < 3}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="sm" className="mr-3" />
                      <span>Actualizando contraseña...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Actualizar Contraseña
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