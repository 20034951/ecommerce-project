import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Settings,
  Phone
} from 'lucide-react';
import ProfileLayout from '../../../layouts/ProfileLayout.jsx';
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
    <ProfileLayout>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">
                Información Personal
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Actualiza tus datos personales
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Success Message */}
          {successMessage && (
            <Alert className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center mr-3">
                  <Save className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <AlertDescription className="text-emerald-800 dark:text-emerald-200 flex-1 text-sm sm:text-base">
                  {successMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* API Error */}
          {apiError && (
            <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <AlertDescription className="text-red-800 dark:text-red-200 flex-1 text-sm sm:text-base">
                  {apiError}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                Nombre Completo
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-800/30 transition-colors">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <Input
                  {...register('name')}
                  id="name"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  className="pl-14 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  disabled={!isEditing || isLoading}
                />
              </div>
              {errors.name && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <span className="font-medium">{errors.name.message}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Email
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-focus-within:bg-blue-100 dark:group-focus-within:bg-blue-800/30 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-14 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  disabled={!isEditing || isLoading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <span className="font-medium">{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                Teléfono 
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">(Opcional)</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-8 h-8 bg-teal-50 dark:bg-teal-900/20 rounded-lg flex items-center justify-center group-focus-within:bg-teal-100 dark:group-focus-within:bg-teal-800/30 transition-colors">
                    <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <Input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  className="pl-14 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500 dark:focus:ring-teal-400"
                  disabled={!isEditing || isLoading}
                />
              </div>
              {errors.phone && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <span className="font-medium">{errors.phone.message}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm hover:shadow transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="h-4 w-4 mr-2" />
                      <span>Guardar Cambios</span>
                    </div>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}