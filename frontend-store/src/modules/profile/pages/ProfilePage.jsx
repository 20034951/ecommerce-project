import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription 
} from '../../../components/ui';
import { 
  User, 
  Mail, 
  Save, 
  ShoppingBag, 
  MapPin, 
  Heart,
  Settings,
  Camera,
  Phone,
  Calendar,
  Shield
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthProvider.jsx';
import { usersApi } from '../../../api/users.js';

const profileSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  email: z.string()
    .email('Debe ser un email válido'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Formato de teléfono inválido')
});

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, updateUser, logout, logoutLocal } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      const response = await usersApi.updateProfile(data);
      
      if (response.emailChanged) {
        // Si se cambió el email, el backend ya cerró todas las sesiones
        // Solo actualizamos el estado local y redirigimos
        setSuccessMessage('Email actualizado. Serás redirigido al login para iniciar sesión con tu nuevo email.');
        
        // Esperar un poco para mostrar el mensaje
        setTimeout(() => {
          // Limpiar el estado de autenticación local sin hacer petición al servidor
          // ya que el backend cerró todas las sesiones
          logoutLocal();
          navigate('/login', { 
            state: { 
              message: 'Tu email ha sido actualizado. Por favor, inicia sesión con tu nuevo email.' 
            } 
          });
        }, 2000);
      } else {
        // Actualizar usuario en el contexto
        updateUser(response.user);
        setSuccessMessage('Perfil actualizado exitosamente');
        setIsEditing(false);
      }
    } catch (error) {
      setApiError(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiError('');
    setSuccessMessage('');
    reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center w-full px-3 py-2 text-left text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-lg font-medium"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Información Personal
                </Link>
                <Link
                  to="/profile/security"
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Seguridad
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  Mis Pedidos
                </Link>
                <Link
                  to="/addresses"
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-3" />
                  Direcciones
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Lista de Deseos
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">
                  Información Personal
                </CardTitle>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Success Message */}
              {successMessage && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* API Error */}
              {apiError && (
                <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Nombre Completo
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <Input
                      {...register('name')}
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <Input
                      {...register('email')}
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                    Teléfono (Opcional)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <Input
                      {...register('phone')}
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button 
                      type="submit" 
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </div>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}