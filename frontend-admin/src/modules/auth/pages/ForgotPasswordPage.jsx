import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import { authApi } from '../../../api/auth.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 
        'Error al enviar el correo de recuperación. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico para recibir instrucciones de recuperación
          </p>
        </div>

        <Card className="p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Correo Enviado
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Se han enviado instrucciones de recuperación a <strong>{email}</strong>.
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                >
                  Enviar Nuevamente
                </Button>
                <Link to="/admin/auth/login">
                  <Button variant="ghost" className="w-full">
                    Volver al Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  {error}
                </Alert>
              )}

              <div>
                <Label htmlFor="email">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Instrucciones'
                  )}
                </Button>

                <Link to="/admin/auth/login">
                  <Button variant="ghost" className="w-full">
                    Volver al Login
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Ecommerce Admin. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}