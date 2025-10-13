# Correcciones de Frontend Admin

## Problema Original
Al intentar hacer login, el frontend estaba enviando la petición a `POST /api/auth/admin/login` pero el backend solo tenía disponible `POST /api/auth/login`, causando un error 404 Not Found.

## Cambios Realizados

### 1. Corrección de Rutas de Autenticación (`frontend-admin/src/api/auth.js`)

#### ✅ Rutas Corregidas:
- **Login**: `POST /api/auth/admin/login` → `POST /api/auth/login`
- **Verificar Token**: `GET /api/auth/verify-admin` → `GET /api/auth/verify`
- **Obtener Perfil**: `GET /api/auth/profile` → `GET /api/auth/verify` (reutilizando endpoint existente)

#### ⚠️ Rutas Temporalmente Deshabilitadas (no implementadas en backend):
- **Recuperar Contraseña**: `POST /api/auth/forgot-password` (lanza error explicativo)
- **Restablecer Contraseña**: `POST /api/auth/reset-password` (lanza error explicativo)

#### ✅ Rutas que Ya Funcionan Correctamente:
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### 2. Actualización del AuthProvider (`frontend-admin/src/auth/AuthProvider.jsx`)

#### Cambios principales:
- **Eliminado localStorage**: El manejo de tokens ahora se hace completamente a través del httpClient
- **Simplificado el estado**: Removidos campos innecesarios como `roles[]` y `currentRole` 
- **Actualizada verificación de autenticación**: Ahora usa la respuesta real del backend `{ valid: true, user: {...} }`
- **Corregida estructura de login**: Maneja la respuesta real del backend `{ message, user, accessToken, refreshToken, expiresIn }`
- **Agregadas funciones de rol**: `hasRole()`, `hasAnyRole()`, `isAdmin()` basadas en `user.role`

### 3. Corrección de Guards (`frontend-admin/src/auth/Guards.jsx`)

#### Cambios principales:
- **Reescritura completa** para eliminar código duplicado y errores de sintaxis
- **Actualización de verificaciones de rol**: Ahora usa `isAdmin()` en lugar de `hasAdminRole`
- **Simplificación de guards**: Removidas funciones no utilizadas
- **Corrección de lógica de autorización**: Los guards ahora verifican correctamente si el usuario tiene rol 'admin' o 'editor'

### 4. Corrección en httpClient (`frontend-admin/src/api/http.js`)

#### Cambios principales:
- **Corregida configuración de cookies**: Removido `httpOnly: true` ya que no se puede establecer desde JavaScript
- **Agregado comentario explicativo**: Las cookies httpOnly deben ser establecidas por el backend

## Verificación de Rutas Backend vs Frontend

### ✅ Rutas que Coinciden:
| Frontend | Backend | Estado |
|----------|---------|--------|
| `POST /api/auth/login` | `POST /api/auth/login` | ✅ Correcto |
| `POST /api/auth/logout` | `POST /api/auth/logout` | ✅ Correcto |
| `POST /api/auth/refresh` | `POST /api/auth/refresh` | ✅ Correcto |
| `GET /api/auth/verify` | `GET /api/auth/verify` | ✅ Correcto |
| `GET /api/users*` | `GET /api/users*` | ✅ Correcto |
| `GET /api/products*` | `GET /api/products*` | ✅ Correcto |
| `GET /api/categories*` | `GET /api/categories*` | ✅ Correcto |
| `GET /api/roles*` | `GET /api/roles*` | ✅ Correcto |

### ⚠️ Funcionalidades Pendientes de Implementar en Backend:
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile` (o usar `/api/auth/verify` existente)

## Estructura de Datos del Backend

### Respuesta de Login:
```json
{
  "message": "Login exitoso",
  "user": {
    "user_id": 1,
    "name": "Usuario",
    "email": "usuario@ejemplo.com",
    "phone": "123456789",
    "role": "admin"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": "15m"
}
```

### Respuesta de Verify:
```json
{
  "valid": true,
  "user": {
    "user_id": 1,
    "name": "Usuario",
    "email": "usuario@ejemplo.com",
    "role": "admin"
  }
}
```

## Roles Soportados en Backend
- `customer` - Cliente regular
- `editor` - Editor del sistema
- `admin` - Administrador completo

El frontend admin permite acceso a usuarios con rol `admin` o `editor`.

## Próximos Pasos

1. **Probar el login**: El frontend admin ahora debería conectarse correctamente con el backend
2. **Implementar funcionalidades faltantes** (opcional):
   - Recuperación de contraseña
   - Perfil de usuario dedicado
3. **Verificar permisos**: Asegurar que las rutas protejan correctamente según el rol del usuario

## Comandos para Probar

```bash
# Backend (puerto 5005)
cd backend
npm start

# Frontend Admin (puerto 5173)
cd frontend-admin  
npm run dev
```

El frontend admin ahora debería poder hacer login correctamente usando las credenciales de un usuario con rol 'admin' o 'editor' en la base de datos.