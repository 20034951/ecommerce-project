# Ejemplo de Uso - Sistema de Recuperación de Contraseñas

## 🧪 Pruebas Rápidas con cURL

### 1. Verificar que el servidor esté funcionando
```bash
curl http://localhost:5005/
```

### 2. Solicitar recuperación de contraseña
```bash
curl -X POST http://localhost:5005/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

### 3. Validar un token (reemplaza TOKEN_AQUI con un token real)
```bash
curl -X POST http://localhost:5005/api/auth/validate-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token": "TOKEN_AQUI"}'
```

**Respuesta esperada (token válido):**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "tokenInfo": {
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-01-01T10:15:00Z"
  }
}
```

### 4. Cambiar contraseña con token
```bash
curl -X POST http://localhost:5005/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_AQUI",
    "newPassword": "nuevaPassword123",
    "confirmPassword": "nuevaPassword123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

### 5. Limpiar tokens expirados (mantenimiento)
```bash
curl -X DELETE http://localhost:5005/api/auth/clean-expired-tokens
```

## 🛠️ Configuración para Desarrollo

### Paso 1: Configurar Variables de Entorno
Crea una cuenta en [Resend.com](https://resend.com) y obtén tu API key:

```bash
# En tu archivo .env
RESEND_API_KEY=re_tu_api_key_aqui
FROM_EMAIL=onboarding@resend.dev  # O tu dominio verificado
FRONTEND_URL=http://localhost:3000
```

### Paso 2: Poblar Base de Datos con Usuario de Prueba
```bash
# Primero poblar la BD
curl -X POST http://localhost:5005/api/seed
```

### Paso 3: Crear Usuario de Prueba (si no existe)
```bash
curl -X POST http://localhost:5005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Prueba",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## 🔧 Troubleshooting

### Error: "Email not sent"
- Verifica que `RESEND_API_KEY` esté configurado correctamente
- Verifica que `FROM_EMAIL` use un dominio verificado en Resend
- Revisa los logs del servidor para más detalles

### Error: "Token inválido o expirado"
- Los tokens expiran en 15 minutos
- Los tokens solo se pueden usar una vez
- Solicita un nuevo token si el anterior expiró

### Error: "Database connection"
- Verifica que MySQL esté ejecutándose
- Verifica las credenciales en el archivo `.env`
- Ejecuta `npm run dev` para ver logs detallados

## 📱 Integración Frontend

### Ejemplo con Fetch API
```javascript
// 1. Solicitar recuperación
async function requestPasswordReset(email) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  console.log(data.message);
}

// 2. Validar token desde URL
async function validateTokenFromURL() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (!token) {
    console.error('No token provided');
    return;
  }
  
  const response = await fetch('/api/auth/validate-reset-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  const data = await response.json();
  
  if (data.valid) {
    console.log('Token válido para:', data.user.email);
    // Mostrar formulario de nueva contraseña
  } else {
    console.error('Token inválido o expirado');
    // Redirigir a solicitar nuevo token
  }
}

// 3. Cambiar contraseña
async function resetPassword(token, newPassword, confirmPassword) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Contraseña cambiada exitosamente');
    // Redirigir a login
  } else {
    console.error('Error:', data.message);
  }
}
```

## 🎯 Flujo Completo de Prueba

1. **Iniciar servidor**: `npm run dev`
2. **Poblar BD**: `POST /api/seed`
3. **Solicitar recuperación**: `POST /api/auth/forgot-password`
4. **Revisar logs** del servidor para ver el token generado
5. **Validar token**: `POST /api/auth/validate-reset-token`
6. **Cambiar contraseña**: `POST /api/auth/reset-password`
7. **Verificar** que las sesiones anteriores se invalidaron

## 📧 Ejemplo de Email que se Envía

El usuario recibirá un email con:
- Asunto: "Recuperación de Contraseña - E-commerce"
- Enlace: `http://localhost:3000/reset-password?token=abc123...`
- Advertencia: Token válido por 15 minutos
- Diseño HTML profesional con botón de acción

## 🔒 Consideraciones de Seguridad

- Los tokens son criptográficamente seguros (32 bytes aleatorios)
- Expiración automática en 15 minutos
- Un solo uso por token
- Invalidación de sesiones al cambiar contraseña
- Logs de seguridad para auditoría
- Respuestas consistentes para evitar enumeración de usuarios