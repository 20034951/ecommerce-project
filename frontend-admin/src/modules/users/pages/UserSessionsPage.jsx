import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import ConfirmationModal from '../../../components/ui/ConfirmationModal.jsx';
import { useConfirmation } from '../../../hooks/useConfirmation.js';
import { usersApi } from '../../../api/users.js';
import {
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  RefreshCw,
  X,
  MapPin,
  Clock,
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  User,
  UserCheck,
  UserX,
  CheckCircle
} from 'lucide-react';

export default function UserSessionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Hook para el modal de confirmación
  const {
    isOpen: isConfirmationOpen,
    confirmationData,
    loading: confirmationLoading,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  } = useConfirmation();

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userResponse, sessionsResponse] = await Promise.all([
        usersApi.getById(id),
        usersApi.getSessions(id)
      ]);
      
      // La API devuelve directamente los datos, no envueltos en .data
      setUser(userResponse);
      setSessions(Array.isArray(sessionsResponse) ? sessionsResponse : []);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = (sessionId, deviceInfo) => {
    showConfirmation({
      title: 'Cerrar Sesión',
      message: `¿Estás seguro de que deseas cerrar la sesión en "${deviceInfo || 'Dispositivo desconocido'}"? El usuario tendrá que iniciar sesión nuevamente en ese dispositivo.`,
      confirmText: 'Cerrar Sesión',
      type: 'warning',
      onConfirm: async () => {
        try {
          await usersApi.terminateSession(id, sessionId);
          setSuccessMessage('Sesión cerrada exitosamente');
          await loadData(); // Recargar datos
        } catch (err) {
          console.error('Error terminating session:', err);
          
          // Manejo de errores más específico
          let errorMessage = 'Error al cerrar la sesión';
          if (err.status === 404) {
            errorMessage = 'La sesión no fue encontrada o ya ha sido cerrada';
          } else if (err.status === 403) {
            errorMessage = 'No tienes permisos para realizar esta acción';
          } else if (err.status === 500) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo';
          }
          
          setError(errorMessage);
          throw err;
        }
      }
    });
  };

  const handleTerminateAllSessions = () => {
    showConfirmation({
      title: 'Cerrar Todas las Sesiones',
      message: `¿Estás seguro de que deseas cerrar todas las sesiones de ${user?.name}? El usuario tendrá que iniciar sesión nuevamente en todos sus dispositivos.`,
      confirmText: 'Cerrar Todas',
      type: 'danger',
      onConfirm: async () => {
        try {
          await usersApi.terminateAllSessions(id);
          setSuccessMessage('Todas las sesiones fueron cerradas exitosamente');
          await loadData(); // Recargar datos
        } catch (err) {
          console.error('Error terminating all sessions:', err);
          
          // Manejo de errores más específico
          let errorMessage = 'Error al cerrar las sesiones';
          if (err.status === 404) {
            errorMessage = 'Usuario no encontrado';
          } else if (err.status === 403) {
            errorMessage = 'No tienes permisos para realizar esta acción';
          } else if (err.status === 500) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo';
          }
          
          setError(errorMessage);
          throw err;
        }
      }
    });
  };

  const getDeviceIcon = (deviceInfo) => {
    const device = deviceInfo?.toLowerCase() || '';
    
    if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
      return <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }
    
    if (device.includes('tablet') || device.includes('ipad')) {
      return <Tablet className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    
    return <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffMs = now - sessionDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-12">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Error</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{error || 'Usuario no encontrado'}</p>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Usuarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/users/${id}`)}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sesiones de {user.name}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Gestiona las sesiones activas del usuario</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={loading}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          {sessions.length > 0 && (
            <Button
              variant="outline"
              onClick={handleTerminateAllSessions}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border-red-300 dark:border-red-600"
              disabled={confirmationLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cerrar Todas
            </Button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Info Card */}
      <Card className="p-8 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{user.name}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {user.email}
            </p>
          </div>
          <div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${
              user.isActive 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}>
              {user.isActive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </Card>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sesiones</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{sessions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dispositivos Móviles</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {sessions.filter(s => {
                  const device = s.device_info?.toLowerCase() || '';
                  return device.includes('mobile') || device.includes('android') || device.includes('iphone');
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sesión Más Reciente</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {sessions.length > 0 
                  ? getTimeAgo(Math.max(...sessions.map(s => new Date(s.last_activity))))
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sessions */}
      <Card className="overflow-hidden shadow-lg">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sesiones Activas ({sessions.length})
              </h3>
            </div>
            {sessions.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Última actividad: {getTimeAgo(Math.max(...sessions.map(s => new Date(s.last_activity))))}
              </div>
            )}
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto mb-4">
              <Monitor className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin sesiones activas</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Este usuario no tiene sesiones activas en este momento.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => (
              <div key={session.session_id} className="p-8 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getDeviceIcon(session.device_info)}
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        {session.device_info || 'Dispositivo Desconocido'}
                      </h4>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {session.ip_address || 'IP no disponible'}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {getTimeAgo(session.last_activity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getTimeAgo(session.last_activity)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Creada: {new Date(session.created_at).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateSession(session.session_id, session.device_info)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border-red-300 dark:border-red-600"
                        disabled={confirmationLoading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500 dark:text-gray-400">ID de Sesión</dt>
                      <dd className="mt-1 text-gray-900 dark:text-white font-mono text-xs">
                        #{session.session_id}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500 dark:text-gray-400">Última Actividad</dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {new Date(session.last_activity).toLocaleString('es-ES')}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Monitor className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500 dark:text-gray-400">Duración</dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {Math.floor((new Date(session.last_activity) - new Date(session.created_at)) / (1000 * 60 * 60))}h
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
    
    {/* Modal de confirmación */}
    <ConfirmationModal
      isOpen={isConfirmationOpen}
      onClose={hideConfirmation}
      onConfirm={handleConfirm}
      title={confirmationData.title}
      message={confirmationData.message}
      confirmText={confirmationData.confirmText}
      cancelText={confirmationData.cancelText}
      type={confirmationData.type}
      loading={confirmationLoading}
    />
    </>
  );
}