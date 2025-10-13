import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import { AlertTriangle, TestTube, ExternalLink, Bug } from 'lucide-react';

export default function ErrorTestPage() {
  const [errorType, setErrorType] = useState('');

  const triggerError = (type) => {
    setErrorType(type);
    
    switch (type) {
      case 'throw':
        // Esto debería ser capturado por el ErrorBoundary
        throw new Error('Error de prueba lanzado intencionalmente');
      
      case 'navigate':
        // Esto debería mostrar la página 404 del admin
        window.location.href = '/admin/pagina-inexistente';
        break;
        
      case 'async':
        // Error asíncrono
        setTimeout(() => {
          throw new Error('Error asíncrono de prueba');
        }, 100);
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Página de Prueba de Errores
        </h1>
        <p className="text-gray-600">
          Esta página te permite probar diferentes tipos de errores para verificar que el manejo de errores funciona correctamente.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Errores de React */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Errores de React
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => triggerError('throw')}
              variant="destructive"
              className="w-full"
              leftIcon={<Bug className="h-4 w-4" />}
            >
              Lanzar Error Síncrono
            </Button>
            
            <Button 
              onClick={() => triggerError('async')}
              variant="destructive"
              className="w-full"
              leftIcon={<Bug className="h-4 w-4" />}
            >
              Lanzar Error Asíncrono
            </Button>
            
            <p className="text-sm text-gray-600">
              Estos errores deberían ser capturados por el ErrorBoundary.
            </p>
          </CardContent>
        </Card>

        {/* Errores de Navegación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Errores de Navegación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              asChild
              variant="outline"
              className="w-full"
            >
              <Link to="/admin/ruta-inexistente">
                Ir a Ruta Inexistente (404)
              </Link>
            </Button>
            
            <Button 
              onClick={() => triggerError('navigate')}
              variant="outline"
              className="w-full"
              leftIcon={<ExternalLink className="h-4 w-4" />}
            >
              Navegar por JS a 404
            </Button>
            
            <p className="text-sm text-gray-600">
              Estos deberían mostrar la página 404 personalizada con el layout del admin.
            </p>
          </CardContent>
        </Card>

        {/* Pruebas de Páginas de Error */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Páginas de Error Directas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/unauthorized">
                  Ver Página No Autorizado
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/admin/error-test-404">
                  Ver Página 404 Admin
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link to="/pagina-no-admin">
                  Ver Página 404 General
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información sobre el Manejo de Errores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <strong>ErrorBoundary:</strong> Captura errores de React que ocurren durante el renderizado, 
              métodos del ciclo de vida y constructores de todo el árbol de componentes.
            </div>
            <div>
              <strong>Router errorElement:</strong> Maneja errores específicos del router como rutas no encontradas 
              o errores durante la carga de componentes lazy.
            </div>
            <div>
              <strong>Páginas 404:</strong> Rutas no encontradas dentro del área admin usan el AdminLayout, 
              mientras que rutas fuera del área admin usan un layout independiente.
            </div>
          </div>
        </CardContent>
      </Card>

      {errorType && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Última acción ejecutada: {errorType}
          </p>
        </div>
      )}
    </div>
  );
}