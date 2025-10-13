import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Spinner } from "../../../components/ui/Spinner.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import { useConfirmation } from "../../../hooks/useConfirmation.js";
import { usersApi } from "../../../api/users.js";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Activity,
  Monitor,
  ArrowLeft,
  Edit3,
  Trash2,
  UserX,
  UserCheck,
  Settings,
  AlertTriangle,
  Clock,
  MapPin,
} from "lucide-react";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  // Hook para el modal de confirmación
  const {
    isOpen: isConfirmationOpen,
    confirmationData,
    loading: confirmationLoading,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  } = useConfirmation();

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getById(id);
      // La API devuelve directamente el objeto usuario
      setUser(response);
    } catch (err) {
      setError("Usuario no encontrado");
      console.error("Error loading user:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await usersApi.getSessions(id);
      // La API devuelve directamente el array de sesiones
      setSessions(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = !user.isActive;
    showConfirmation({
      title: `${newStatus ? "Activar" : "Desactivar"} Usuario`,
      message: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} a ${user.name}? ${!newStatus ? "Se cerrarán todas sus sesiones activas." : ""}`,
      confirmText: newStatus ? "Activar" : "Desactivar",
      type: newStatus ? "success" : "warning",
      onConfirm: async () => {
        try {
          await usersApi.update(id, { isActive: newStatus });
          setUser((prev) => ({ ...prev, isActive: newStatus }));
        } catch (err) {
          setError("Error al cambiar estado del usuario");
          console.error("Error toggling user status:", err);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      },
    });
  };

  const handleRoleChange = (newRole) => {
    const currentRoleDisplay = getRoleDisplayName(user.role);
    const newRoleDisplay = getRoleDisplayName(newRole);

    showConfirmation({
      title: "Cambiar Rol de Usuario",
      message: `¿Estás seguro de que deseas cambiar el rol de ${user.name} de "${currentRoleDisplay}" a "${newRoleDisplay}"? Este cambio será inmediato y puede afectar los permisos del usuario.`,
      confirmText: "Cambiar Rol",
      type: "question",
      onConfirm: async () => {
        try {
          await usersApi.updateRole(id, newRole);
          setUser((prev) => ({ ...prev, role: newRole }));
        } catch (err) {
          setError("Error al cambiar rol del usuario");
          console.error("Error changing user role:", err);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      },
    });
  };

  const handleDeleteUser = () => {
    showConfirmation({
      title: "Eliminar Usuario",
      message: `¿Estás seguro de que deseas eliminar permanentemente al usuario "${user.name}"? Esta acción no se puede deshacer y se eliminarán todos los datos asociados al usuario.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "destructive",
      onConfirm: async () => {
        try {
          await usersApi.delete(id);
          // Redirigir a la lista de usuarios después de eliminar
          navigate("/admin/users");
        } catch (err) {
          setError("Error al eliminar el usuario");
          console.error("Error deleting user:", err);
          throw err; // Relanzar el error para que el modal no se cierre
        }
      },
    });
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "secondary";
      case "customer":
        return "default";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "editor":
        return "Editor";
      case "customer":
        return "Cliente";
      default:
        return role;
    }
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Error
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {error || "Usuario no encontrado"}
          </p>
          <Button onClick={() => navigate("/admin/users")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Usuarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/users")}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant={getRoleBadgeVariant(user.role)}
              className="text-sm px-3 py-1"
            >
              <Shield className="h-3 w-3 mr-1" />
              {getRoleDisplayName(user.role)}
            </Badge>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${
                user.isActive
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              }`}
            >
              {user.isActive ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <UserX className="h-3 w-3" />
              )}
              {user.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <User className="h-4 w-4" />
              Información
            </button>
            <button
              onClick={() => {
                setActiveTab("sessions");
                if (sessions.length === 0 && !sessionsLoading) {
                  loadSessions();
                }
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "sessions"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Monitor className="h-4 w-4" />
              Sesiones
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === "actions"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Settings className="h-4 w-4" />
              Acciones
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Información del Usuario
                  </h3>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nombre
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {user.name}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {user.email}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Teléfono
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {user.phone || "No especificado"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Rol
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {getRoleDisplayName(user.role)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Activity className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estado
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {user.isActive ? "Activo" : "Inactivo"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fecha de Registro
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                        {new Date(user.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </dd>
                    </div>
                  </div>
                </dl>
              </Card>
            </div>

            {/* User Avatar Card */}
            <div>
              <Card className="p-8 text-center shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {user.email}
                  </p>
                  <div className="space-y-3 w-full">
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="w-full justify-center py-2"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/users/${id}/edit`)}
                        className="flex-1"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <Card className="p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sesiones Activas
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSessions}
                disabled={sessionsLoading}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                {sessionsLoading ? <Spinner size="sm" /> : "Actualizar"}
              </Button>
            </div>

            {sessionsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto mb-4">
                  <Monitor className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay sesiones activas
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Dispositivo
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          IP
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Última Actividad
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Creada
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sessions.map((session) => (
                      <tr
                        key={session.session_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {session.device_info || "Desconocido"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {session.ip_address || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {new Date(session.last_activity).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {new Date(session.created_at).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {activeTab === "actions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Management */}
            <Card className="p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gestión de Roles
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Rol Actual:{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </label>
                  <div className="space-y-3">
                    {["customer", "editor", "admin"].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        disabled={user.role === role}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          user.role === role
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {getRoleDisplayName(role)}
                          </div>
                          {user.role === role && (
                            <span className="text-blue-600 dark:text-blue-400">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Acciones de Cuenta
                </h3>
              </div>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/users/${id}/edit`)}
                  className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Usuario
                </Button>

                <Button
                  variant="outline"
                  onClick={handleToggleStatus}
                  className={`w-full justify-start ${
                    user.isActive
                      ? "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border-red-300 dark:border-red-600"
                      : "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 border-green-300 dark:border-green-600"
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <UserX className="w-4 h-4 mr-2" />
                      Desactivar Usuario
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Activar Usuario
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/users/${id}/sessions`)}
                  className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Gestionar Sesiones
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDeleteUser}
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border-red-300 dark:border-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Usuario
                </Button>
              </div>
            </Card>
          </div>
        )}
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
