import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle,
  Alert,
  AlertDescription 
} from '../../../components/ui';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../auth/AuthProvider.jsx';

const loginSchema = z.object({
  usernameOrEmail: z.string()
    .min(1, 'El usuario o email es requerido')
    .refine((value) => {
      // Check if it's an email or username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || value.length >= 3;
    }, 'Debe ser un email válido o un usuario de al menos 3 caracteres'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({
        email: data.usernameOrEmail,
        password: data.password
      });
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by AuthProvider
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Auth Error */}
            {authError && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {authError}
                </AlertDescription>
              </Alert>
            )}

            {/* Email/Username Field */}
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail" className="text-gray-700 dark:text-gray-300">
                Usuario o Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  {...register('usernameOrEmail')}
                  id="usernameOrEmail"
                  type="text"
                  placeholder="tu@email.com o usuario"
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </div>
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}