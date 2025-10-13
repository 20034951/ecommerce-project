import React, { useState, useEffect } from 'react';
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
  Shield, 
  Smartphone, 
  Monitor, 
  Tablet, 
  LogOut,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { customersApi } from '../../../api/customers.js';
import { useAuth } from '../../../auth/AuthProvider.jsx';

const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function SecurityPage() {
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [terminatingSession, setTerminatingSession] = useState('');
  const { logoutLocal } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  // Obtener las sesiones activas
  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await customersApi.getSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      setApiError('Error al cargar las sesiones activas');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Cerrar una sesión específica
  const handleTerminateSession = async (sessionId) => {
    try {
      setTerminatingSession(sessionId);
      await customersApi.terminateSession(sessionId);
      setSuccessMessage('Sesión cerrada exitosamente');
      await fetchSessions(); // Recargar sesiones
    } catch (error) {
      setApiError(error.message || 'Error al cerrar la sesión');
    } finally {
      setTerminatingSession('');
    }
  };

  // Cerrar todas las demás sesiones
  const handleTerminateAllOther = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await customersApi.terminateAllOtherSessions();
      setSuccessMessage(`Se cerraron ${response.closedSessions} sesiones`);
      await fetchSessions(); // Recargar sesiones
    } catch (error) {
      setApiError(error.message || 'Error al cerrar las sesiones');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Cambiar contraseña
  const onSubmitPassword = async (data) => {
    setIsChangingPassword(true);
    setApiError('');
    setSuccessMessage('');
    
    try {
      const response = await customersApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      // Mostrar mensaje de éxito por un momento
      setSuccessMessage('Contraseña actualizada exitosamente. Serás redirigido al login para iniciar sesión nuevamente.');
      
      // Esperar un poco para mostrar el mensaje, luego cerrar sesión local y redirigir
      setTimeout(() => {
        // El backend ya cerró todas las sesiones, solo limpiamos el estado local
        logoutLocal();
        navigate('/login', { 
          state: { 
            message: 'Tu contraseña ha sido actualizada. Por favor, inicia sesión con tu nueva contraseña.' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      setApiError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Obtener icono del dispositivo
  const getDeviceIcon = (userAgent = '') => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-5 w-5" />;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  // Obtener información del dispositivo/navegador
  const getDeviceInfo = (userAgent = '') => {
    if (!userAgent) return 'Dispositivo desconocido';
    
    const ua = userAgent.toLowerCase();
    let device = 'Escritorio';
    let browser = 'Navegador desconocido';
    
    // Detectar tipo de dispositivo
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      device = 'Móvil';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      device = 'Tablet';
    }
    
    // Detectar navegador
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    
    return `${device} - ${browser}`;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seguridad</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tu contraseña y las sesiones activas de tu cuenta
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* API Error */}
      {apiError && (
        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {apiError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cambiar Contraseña */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Lock className="h-5 w-5 mr-2" />
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
              {/* Contraseña Actual */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
                  Contraseña Actual
                </Label>
                <div className="relative">
                  <Input
                    {...register('currentPassword')}
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    {...register('newPassword')}
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cambiando contraseña...
                  </div>
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sesiones Activas */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Shield className="h-5 w-5 mr-2" />
                Sesiones Activas
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={fetchSessions}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingSessions}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingSessions ? 'animate-spin' : ''}`} />
                </Button>
                {sessions.length > 1 && (
                  <Button
                    onClick={handleTerminateAllOther}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingSessions}
                    className="border-red-300 dark:border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cerrar Otras
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingSessions ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando sesiones...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No hay sesiones activas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sessions.map((session) => (
                  <div key={session.session_id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-gray-400 dark:text-gray-500 mt-1">
                          {getDeviceIcon(session.user_agent)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {getDeviceInfo(session.user_agent)}
                            </p>
                            {session.is_current && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Actual
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            IP: {session.ip_address}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Iniciada: {formatDate(session.created_at)}
                          </p>
                        </div>
                      </div>
                      {!session.is_current && (
                        <Button
                          onClick={() => handleTerminateSession(session.session_id)}
                          variant="outline"
                          size="sm"
                          disabled={terminatingSession === session.session_id}
                          className="border-red-300 dark:border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {terminatingSession === session.session_id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                          ) : (
                            <LogOut className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}