import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import ConfirmationModal from '../../../components/ui/ConfirmationModal.jsx';
import { useConfirmation } from '../../../hooks/useConfirmation.js';
import { usersApi } from '../../../api/users.js';
import { Users, UserPlus, UserCheck, UserX, Shield, Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

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
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores previos
      const response = await usersApi.getAll();
      
      // La API devuelve directamente el array de usuarios
      const usersData = Array.isArray(response) ? response : [];
      
      setUsers(usersData);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error loading users:', err);
      setUsers([]); // Asegurar que users sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    showConfirmation({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar a "${userName}"? Esta acción no se puede deshacer y se eliminarán todos los datos asociados al usuario.`,
      confirmText: 'Eliminar',
      type: 'danger',
      onConfirm: async () => {
        try {
          await usersApi.delete(userId);
          await loadUsers();
        } catch (err) {
          setError('Error al eliminar usuario');
          console.error('Error deleting user:', err);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      }
    });
  };

  const handleToggleStatus = (userId, currentStatus, userName) => {
    const newStatus = !currentStatus;
    showConfirmation({
      title: `${newStatus ? 'Activar' : 'Desactivar'} Usuario`,
      message: `¿Estás seguro de que deseas ${newStatus ? 'activar' : 'desactivar'} a "${userName}"? ${!newStatus ? 'Se cerrarán todas sus sesiones activas.' : ''}`,
      confirmText: newStatus ? 'Activar' : 'Desactivar',
      type: newStatus ? 'success' : 'warning',
      onConfirm: async () => {
        try {
          await usersApi.update(userId, { isActive: newStatus });
          await loadUsers();
        } catch (err) {
          setError('Error al cambiar estado del usuario');
          console.error('Error toggling user status:', err);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      }
    });
  };

  const handlePasswordReset = (userEmail, userName) => {
    showConfirmation({
      title: 'Restablecer Contraseña',
      message: `¿Estás seguro de que deseas enviar un email de recuperación de contraseña a "${userName}" (${userEmail})? El usuario recibirá un enlace para restablecer su contraseña.`,
      confirmText: 'Enviar Email',
      type: 'info',
      onConfirm: async () => {
        try {
          await usersApi.requestPasswordReset(userEmail);
          setSuccessMessage(`Email de recuperación enviado a ${userEmail}`);
          // No necesitamos recargar usuarios ya que esta acción no los modifica
        } catch (err) {
          console.error('Error sending password reset email:', err);
          
          // Manejo de errores más específico
          let errorMessage = 'Error al enviar email de recuperación';
          if (err.status === 400) {
            errorMessage = 'Email inválido o no encontrado';
          } else if (err.status === 500) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo';
          }
          
          setError(errorMessage);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      }
    });
  };

  const filteredUsers = users.filter(user => {
    // Verificar que user existe y tiene las propiedades necesarias
    if (!user) return false;
    
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'secondary';
      case 'customer': return 'default';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'customer': return 'Cliente';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuarios</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los usuarios del sistema de manera eficiente
          </p>
        </div>
        <Button 
          onClick={() => navigate('/admin/users/create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
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

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u && u.isActive === true).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administradores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u && u.role === 'admin').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u && u.role === 'customer').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="w-full sm:w-48 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="customer">Cliente</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md">
          {error}
        </div>
      )}  

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No hay usuarios</p>
                    <p className="text-gray-500">Comienza creando tu primer usuario.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive === true
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {user.isActive === true ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.user_id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.user_id}/edit`)}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordReset(user.email, user.name)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                      >
                        Restablecer Contraseña
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.user_id, user.isActive, user.name)}
                        className={user.isActive === true ? 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300' : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'}
                      >
                        {user.isActive === true ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.user_id, user.name)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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