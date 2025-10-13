import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardContent,
  Alert,
  AlertDescription 
} from '../../../components/ui';
import { Mail, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../auth/AuthProvider.jsx';

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido')
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [apiError, setApiError] = useState('');
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      await forgotPassword(data.email);
      setIsEmailSent(true);
    } catch (error) {
      setApiError(error.message || 'Error al enviar el email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Success State */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Enviado</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Revisa tu bandeja de entrada
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Hemos enviado un enlace de recuperación de contraseña a:
              </p>
              <p className="font-semibold text-primary-600 dark:text-primary-400">
                {getValues('email')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El enlace expirará en 1 hora. Si no recibes el email, revisa tu carpeta de spam.
              </p>
              
              <div className="pt-4">
                <Button 
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600"
                >
                  Enviar a otro email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recuperar Contraseña</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ingresa tu email para recibir un enlace de recuperación
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* API Error */}
            {apiError && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {apiError}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Dirección de Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Enlace de Recuperación
                </div>
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Recordaste tu contraseña?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
                >
                  Inicia sesión
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