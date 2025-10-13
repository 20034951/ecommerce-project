import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { Home, RefreshCw, AlertTriangle, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error en el próximo renderizado
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aquí podrías enviar el error a un servicio como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full text-center">
            {/* Icono de error */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Bug className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-4">¡Ups!</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
              <p className="text-gray-600">
                Ha ocurrido un error inesperado en la aplicación. Nuestro equipo ha sido notificado.
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="space-y-3">
              <Button 
                onClick={this.handleRefresh} 
                className="w-full" 
                size="lg"
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Recargar Página
              </Button>
              
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/admin/dashboard" className="flex items-center justify-center">
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Dashboard
                </Link>
              </Button>
            </div>

            {/* Información técnica (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Información técnica:
                </h3>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">{this.state.error.toString()}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 whitespace-pre-wrap max-h-40 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Si el problema persiste, contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;