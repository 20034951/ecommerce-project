import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Spinner } from '../../../components/ui/Spinner.jsx';
import { authApi } from '../../../api/auth.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Token de recuperación inválido o expirado.');
    }
  }, [token, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setIsSubmitting(false);
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Error al restablecer la contraseña. El token puede haber expirado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if no token
  if (!token || !email) {
    return <Navigate to="/admin/auth/login" replace />;
  }

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
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña para <strong>{email}</strong>
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
                  Contraseña Actualizada
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Tu contraseña ha sido actualizada exitosamente. 
                  Ahora puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
              <Link to="/admin/auth/login">
                <Button className="w-full">
                  Ir al Login
                </Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  {error}
                </Alert>
              )}

              <div>
                <Label htmlFor="password">
                  Nueva Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Debe tener al menos 8 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  minLength={8}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !formData.password || !formData.confirmPassword}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Contraseña'
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