import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import ConfirmationModal from '../../../components/ui/ConfirmationModal.jsx';
import { useConfirmation } from '../../../hooks/useConfirmation.js';
import { usersApi } from '../../../api/users.js';
import {
  User,
  Mail,
  Phone,
  Shield,
  Settings,
  ArrowLeft,
  Save,
  AlertTriangle
} from 'lucide-react';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    isActive: true
  });

  // Hook para el modal de confirmación
  const {
    isOpen: isConfirmationOpen,
    confirmationData,
    loading: confirmationLoading,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  } = useConfirmation();

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await usersApi.getById(id);
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'customer',
        isActive: user.isActive
      };
      setFormData(userData);
      setOriginalData(userData); // Guardar datos originales para comparar cambios
    } catch (err) {
      console.error('Error loading user:', err);
      // Redirigir si el usuario no existe
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si hay cambios
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Función para obtener lista de cambios
  const getChanges = () => {
    const changes = [];
    if (formData.name !== originalData.name) changes.push(`Nombre: "${originalData.name}" → "${formData.name}"`);
    if (formData.email !== originalData.email) changes.push(`Email: "${originalData.email}" → "${formData.email}"`);
    if (formData.phone !== originalData.phone) changes.push(`Teléfono: "${originalData.phone || 'Sin teléfono'}" → "${formData.phone || 'Sin teléfono'}"`);
    if (formData.role !== originalData.role) changes.push(`Rol: "${originalData.role}" → "${formData.role}"`);
    if (formData.isActive !== originalData.isActive) changes.push(`Estado: ${originalData.isActive ? 'Activo' : 'Inactivo'} → ${formData.isActive ? 'Activo' : 'Inactivo'}`);
    return changes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar formulario
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Verificar si hay cambios
    if (!hasChanges()) {
      showConfirmation({
        title: 'Sin Cambios',
        message: 'No has realizado ningún cambio en los datos del usuario. ¿Deseas volver a la página de detalles?',
        confirmText: 'Volver',
        type: 'info',
        onConfirm: async () => {
          navigate(`/admin/users/${id}`);
        }
      });
      return;
    }

    // Mostrar confirmación con resumen de cambios
    const changes = getChanges();
    const changesText = changes.length > 3 
      ? `${changes.slice(0, 3).join('\n')}... y ${changes.length - 3} cambios más`
      : changes.join('\n');

    showConfirmation({
      title: 'Guardar Cambios',
      message: `¿Estás seguro de que deseas guardar los siguientes cambios?\n\n${changesText}`,
      confirmText: 'Guardar',
      type: 'question',
      onConfirm: async () => {
        try {
          setSaving(true);
          setErrors({});
          
          await usersApi.update(id, {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone?.trim() || null,
            role: formData.role,
            isActive: formData.isActive
          });
          
          // Redirigir al detalle del usuario
          navigate(`/admin/users/${id}`);
        } catch (err) {
          console.error('Error updating user:', err);
          if (err.status === 400 && err.data?.message) {
            if (err.data.message.includes('email')) {
              setErrors({ email: 'Este email ya está en uso' });
            } else {
              setErrors({ general: err.data.message });
            }
          } else {
            setErrors({ general: 'Error al actualizar el usuario' });
          }
          throw err; // Relanzar para mantener el modal abierto en caso de error
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleCancel = () => {
    if (hasChanges()) {
      const changes = getChanges();
      showConfirmation({
        title: 'Descartar Cambios',
        message: `Tienes cambios sin guardar. Si continúas, se perderán los siguientes cambios:\n\n${changes.slice(0, 3).join('\n')}${changes.length > 3 ? '...' : ''}\n\n¿Estás seguro de que deseas salir sin guardar?`,
        confirmText: 'Salir sin Guardar',
        cancelText: 'Continuar Editando',
        type: 'warning',
        onConfirm: async () => {
          navigate(`/admin/users/${id}`);
        }
      });
    } else {
      navigate(`/admin/users/${id}`);
    }
  };

  const handleBackToList = () => {
    if (hasChanges()) {
      showConfirmation({
        title: 'Descartar Cambios',
        message: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas volver a la lista de usuarios sin guardar los cambios?',
        confirmText: 'Salir sin Guardar',
        cancelText: 'Continuar Editando',
        type: 'warning',
        onConfirm: async () => {
          navigate('/admin/users');
        }
      });
    } else {
      navigate('/admin/users');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Usuario</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Modifica la información del usuario y sus permisos
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleBackToList}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Form */}
      <Card className="p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              {errors.general}
            </div>
          )}

          {/* Información Personal */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre completo *</Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre completo"
                    className={`pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className={`pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono</Label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Rol */}
              <div>
                <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Rol *</Label>
                <div className="mt-1 relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="customer">Cliente</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración</h3>
            </div>
            <div>
              <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Usuario activo</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    El usuario podrá iniciar sesión y utilizar la plataforma
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving || confirmationLoading}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || confirmationLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Información adicional */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Información importante</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Los cambios en el rol del usuario tomarán efecto inmediatamente.</p>
              <p>• Si desactivas el usuario, se cerrarán todas sus sesiones activas.</p>
              <p>• El email debe ser único en el sistema.</p>
              <p>• Para cambiar la contraseña, utiliza la función de restablecimiento de contraseña.</p>
            </div>
          </div>
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