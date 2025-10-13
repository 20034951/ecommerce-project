# API de Recuperación de Contraseñas

Este documento describe los endpoints para la funcionalidad de recuperación de contraseñas del sistema de e-commerce.

## Configuración Necesaria

### Variables de Entorno

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=tu-resend-api-key-aqui
FROM_EMAIL=noreply@tudominio.com
FRONTEND_URL=http://localhost:3000
```

### Obtener API Key de Resend

1. Crea una cuenta en [Resend](https://resend.com)
2. Verifica tu dominio o usa el dominio de prueba
3. Genera una API Key en el dashboard
4. Configura la variable `RESEND_API_KEY`

## Endpoints

### 1. Solicitar Recuperación de Contraseña

**POST** `/api/auth/forgot-password`

Envía un email con un token de recuperación al usuario.

#### Request Body
```json
{
  "email": "usuario@ejemplo.com"
}
```

#### Response
```json
{
  "success": true,
  "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

#### Características
- **Seguridad**: Siempre devuelve éxito, incluso si el email no existe
- **Token único**: Cada solicitud invalida tokens anteriores
- **Expiración**: Los tokens expiran en 15 minutos
- **Email**: Envía un email con enlace de recuperación

---

### 2. Validar Token de Recuperación

**POST** `/api/auth/validate-reset-token`

Valida si un token de recuperación es válido y no ha expirado.

#### Request Body
```json
{
  "token": "abc123def456..."
}
```

#### Response (Token Válido)
```json
{
  "success": true,
  "valid": true,
  "user": {
    "user_id": 1,
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo"
  },
  "tokenInfo": {
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-01-01T10:15:00Z"
  }
}
```

#### Response (Token Inválido)
```json
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

#### Características
- **Validación**: Verifica que el token existe, no esté usado y no haya expirado
- **Información del usuario**: Devuelve datos básicos del usuario
- **Información del token**: Incluye fechas de creación y expiración

---

### 3. Cambiar Contraseña con Token

**POST** `/api/auth/reset-password`

Cambia la contraseña del usuario usando un token válido de recuperación.

#### Request Body
```json
{
  "token": "abc123def456...",
  "newPassword": "nuevaContraseña123",
  "confirmPassword": "nuevaContraseña123"
}
```

#### Response (Éxito)
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

#### Response (Error)
```json
{
  "success": false,
  "message": "Las contraseñas no coinciden"
}
```

#### Características
- **Validación de contraseña**: Mínimo 6 caracteres
- **Confirmación**: Las contraseñas deben coincidir
- **Token único**: Marca el token como usado
- **Seguridad**: Invalida todas las sesiones activas del usuario
- **Notificación**: Envía email de confirmación

---

### 4. Limpiar Tokens Expirados (Mantenimiento)

**DELETE** `/api/auth/clean-expired-tokens`

Elimina tokens expirados de la base de datos (endpoint de mantenimiento).

#### Response
```json
{
  "success": true,
  "message": "Se eliminaron 5 tokens expirados",
  "deletedCount": 5
}
```

#### Características
- **Mantenimiento**: Elimina tokens que ya expiraron
- **Automático**: El sistema también limpia automáticamente cada hora
- **Estadísticas**: Devuelve cantidad de tokens eliminados

## Flujo de Uso Completo

### 1. Usuario Olvida su Contraseña
```javascript
// Frontend solicita recuperación
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'usuario@ejemplo.com' })
});
```

### 2. Usuario Recibe Email
El usuario recibe un email con un enlace como:
```
https://tudominio.com/reset-password?token=abc123def456...
```

### 3. Frontend Valida Token
```javascript
// Antes de mostrar el formulario, validar el token
const response = await fetch('/api/auth/validate-reset-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: tokenFromUrl })
});

if (response.ok) {
  const data = await response.json();
  if (data.valid) {
    // Mostrar formulario de nueva contraseña
    showResetForm(data.user);
  } else {
    // Mostrar error: token inválido
    showError('Token inválido o expirado');
  }
}
```

### 4. Usuario Cambia Contraseña
```javascript
// Enviar nueva contraseña
const response = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: tokenFromUrl,
    newPassword: 'nuevaContraseña123',
    confirmPassword: 'nuevaContraseña123'
  })
});

if (response.ok) {
  // Redirigir a login
  redirectToLogin('Contraseña actualizada exitosamente');
}
```

## Seguridad

### Características de Seguridad Implementadas

1. **Tokens únicos**: Cada token se genera con crypto.randomBytes(32)
2. **Expiración corta**: 15 minutos de vida útil
3. **Un solo uso**: Los tokens se marcan como usados después del cambio
4. **Invalidación previa**: Nuevas solicitudes invalidan tokens anteriores
5. **Sesiones**: Se cierran todas las sesiones activas al cambiar contraseña
6. **Rate limiting**: Se puede implementar para evitar spam
7. **Email de confirmación**: Notifica al usuario sobre el cambio

### Consideraciones de Producción

1. **Rate Limiting**: Implementar límites por IP para evitar spam
2. **Logs**: Registrar intentos de recuperación para auditoría
3. **Monitoreo**: Alertas por uso excesivo del endpoint
4. **Dominios verificados**: Usar dominios verificados en Resend
5. **HTTPS**: Usar solo en conexiones seguras

## Base de Datos

### Tabla: password_reset_tokens

```sql
CREATE TABLE password_reset_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
```

### Índices para Optimización

```sql
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
```

## Ejemplo de Integración Frontend

### React Hook para Recuperación

```javascript
import { useState } from 'react';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestReset = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        return { valid: true, user: data.user };
      } else {
        throw new Error(data.message || 'Token inválido');
      }
    } catch (err) {
      setError(err.message);
      return { valid: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    requestReset,
    validateToken,
    resetPassword,
    loading,
    error
  };
};
```

## Troubleshooting

### Problemas Comunes

1. **Email no llega**
   - Verificar API key de Resend
   - Verificar dominio verificado
   - Revisar logs del servidor

2. **Token inválido**
   - Verificar que no haya expirado (15 min)
   - Verificar que no se haya usado ya
   - Verificar formato del token en URL

3. **Error de base de datos**
   - Verificar que la tabla existe
   - Verificar conexión a BD
   - Verificar sincronización de modelos

### Logs Útiles

El sistema genera logs para:
- Solicitudes de recuperación
- Validaciones de token
- Cambios de contraseña exitosos
- Limpieza automática de tokens
- Errores de email

## Testing

Ejecuta las pruebas con:

```bash
npm test -- passwordReset.test.js
```

Las pruebas cubren:
- Solicitud de recuperación
- Validación de tokens
- Cambio de contraseña
- Limpieza de tokens expirados
- Casos de error y seguridad