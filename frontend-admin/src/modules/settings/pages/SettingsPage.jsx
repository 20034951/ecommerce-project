import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';
import { Settings, Database, Shield, Bell, Palette, Globe, Mail, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuraciones</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Administra las configuraciones generales del sistema y personalizaciones
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
          <Settings className="h-4 w-4" />
          Guardar Cambios
        </button>
      </div>
      
      <Card className="p-8 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/20 dark:to-slate-800/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Settings className="h-10 w-10 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Panel de Configuraciones del Sistema
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Personaliza y configura todos los aspectos de tu aplicación, desde la seguridad hasta la apariencia visual.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-3">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Base de Datos</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Conexiones y backups</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg w-fit mx-auto mb-3">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Seguridad</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Autenticación y permisos</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg w-fit mx-auto mb-3">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Notificaciones</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Alertas y avisos</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mx-auto mb-3">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Apariencia</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Temas y colores</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mx-auto mb-3">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Localización</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Idioma y región</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg w-fit mx-auto mb-3">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Email</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Configuración SMTP</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mx-auto mb-3">
                <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">API Keys</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Integraciones externas</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg w-fit mx-auto mb-3">
                <Settings className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Avanzado</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Configuraciones técnicas</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Esta funcionalidad estará disponible próximamente
          </div>
        </div>
      </Card>
    </div>
  );
}