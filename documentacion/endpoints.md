# API Backend - Documentación de Endpoints

## Información General

- **Base URL**: `http://localhost:5005`
- **Formato**: JSON
- **Autenticación**: No implementada
- **Cache**: Redis implementado en consultas GET

## Endpoints Disponibles

### 📊 Health Check

#### GET /
Verifica que el backend esté funcionando correctamente.

**URL**: `GET /`

**Respuesta**:
```json
{
  "message": "Backend running"
}
```

---

## 👤 Usuarios (Users)

### GET /api/users
Obtiene todos los usuarios del sistema.

**URL**: `GET /api/users`

**Cache**: ✅ TTL: 300 segundos

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "username": "juanperez",
    "email": "juan@example.com",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "Roles": [
      {
        "id": 1,
        "name": "admin",
        "description": "Administrador del sistema"
      }
    ]
  }
]
```

### GET /api/users/:id
Obtiene un usuario específico por ID.

**URL**: `GET /api/users/{id}`

**Parámetros**:
- `id` (number): ID del usuario

**Cache**: ✅ TTL: 300 segundos

**Respuesta exitosa (200)**:
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "username": "juanperez",
  "email": "juan@example.com",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "Roles": []
}
```

**Error (404)**:
```json
{
  "error": "User not found"
}
```

### POST /api/users
Crea un nuevo usuario.

**URL**: `POST /api/users`

**Body**:
```json
{
  "name": "María González",
  "username": "mariagonzalez",
  "email": "maria@example.com",
  "password": "123456",
  "roles": [1, 2]  // Opcional: array de IDs de roles
}
```

**Respuesta exitosa (201)**:
```json
{
  "id": 2,
  "name": "María González",
  "username": "mariagonzalez",
  "email": "maria@example.com",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errores posibles**:
- `400`: Validation error (campos requeridos, email/username duplicado)
- `500`: Error interno del servidor

### PUT /api/users/:id
Actualiza un usuario existente.

**URL**: `PUT /api/users/{id}`

**Body** (todos los campos son opcionales):
```json
{
  "name": "María González Updated",
  "username": "mariagonzalez2",
  "email": "maria2@example.com",
  "password": "newpassword",
  "isActive": false,
  "roles": [2]
}
```

**Respuesta exitosa (200)**:
```json
{
  "id": 2,
  "name": "María González Updated",
  "username": "mariagonzalez2",
  "email": "maria2@example.com",
  "isActive": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T01:00:00.000Z"
}
```

### DELETE /api/users/:id
Elimina un usuario.

**URL**: `DELETE /api/users/{id}`

**Respuesta exitosa (200)**:
```json
{
  "message": "User deleted successfully"
}
```

**Error (404)**:
```json
{
  "error": "User not found"
}
```

---

## 🏷️ Categorías (Categories)

### GET /api/categories
Obtiene todas las categorías.

**URL**: `GET /api/categories`

**Cache**: ✅ TTL: 120 segundos

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Electrónicos",
    "description": "Dispositivos electrónicos",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET /api/categories/with-products
Obtiene todas las categorías con sus productos asociados.

**URL**: `GET /api/categories/with-products`

**Cache**: ✅ TTL: 120 segundos

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Electrónicos",
    "description": "Dispositivos electrónicos",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "Products": [
      {
        "id": 1,
        "name": "iPhone 15",
        "value": "999.99"
      }
    ]
  }
]
```

### GET /api/categories/:id
Obtiene una categoría específica.

**URL**: `GET /api/categories/{id}`

**Cache**: ✅ TTL: 120 segundos

**Respuesta exitosa (200)**:
```json
{
  "id": 1,
  "name": "Electrónicos",
  "description": "Dispositivos electrónicos",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### POST /api/categories
Crea una nueva categoría.

**URL**: `POST /api/categories`

**Body**:
```json
{
  "name": "Ropa",
  "description": "Vestimenta y accesorios"
}
```

**Respuesta exitosa (201)**:
```json
{
  "id": 2,
  "name": "Ropa",
  "description": "Vestimenta y accesorios",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /api/categories/:id
Actualiza una categoría existente.

**URL**: `PUT /api/categories/{id}`

**Body**:
```json
{
  "name": "Ropa y Calzado",
  "description": "Vestimenta, accesorios y calzado"
}
```

**Respuesta exitosa (200)**:
```json
{
  "id": 2,
  "name": "Ropa y Calzado",
  "description": "Vestimenta, accesorios y calzado",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T01:00:00.000Z"
}
```

### DELETE /api/categories/:id
Elimina una categoría.

**URL**: `DELETE /api/categories/{id}`

**Respuesta exitosa (200)**:
```json
{
  "message": "Category successfully removed"
}
```

---

## 📦 Productos (Products)

### GET /api/products
Obtiene todos los productos con información de categoría.

**URL**: `GET /api/products`

**Cache**: ✅ TTL: 120 segundos

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "description": "Smartphone Apple con chip A17 Pro",
    "value": "999.99",
    "stock": 50,
    "imagePath": "/images/iphone15.jpg",
    "categoryId": 1,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "Category": {
      "id": 1,
      "name": "Electrónicos"
    }
  }
]
```

### GET /api/products/:id
Obtiene un producto específico con información de categoría.

**URL**: `GET /api/products/{id}`

**Cache**: ✅ TTL: 120 segundos

**Respuesta exitosa (200)**:
```json
{
  "id": 1,
  "name": "iPhone 15",
  "description": "Smartphone Apple con chip A17 Pro",
  "value": "999.99",
  "stock": 50,
  "imagePath": "/images/iphone15.jpg",
  "categoryId": 1,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "Category": {
    "id": 1,
    "name": "Electrónicos"
  }
}
```

### POST /api/products
Crea un nuevo producto.

**URL**: `POST /api/products`

**Body**:
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Smartphone Samsung con pantalla AMOLED",
  "value": 899.99,
  "stock": 30,
  "imagePath": "/images/galaxy-s24.jpg",
  "categoryId": 1
}
```

**Respuesta exitosa (201)**:
```json
{
  "id": 2,
  "name": "Samsung Galaxy S24",
  "description": "Smartphone Samsung con pantalla AMOLED",
  "value": "899.99",
  "stock": 30,
  "imagePath": "/images/galaxy-s24.jpg",
  "categoryId": 1,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errores**:
- `400`: Invalid category (si categoryId no existe)

### PUT /api/products/:id
Actualiza un producto existente.

**URL**: `PUT /api/products/{id}`

**Body** (todos los campos opcionales):
```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Smartphone Samsung premium",
  "value": 1199.99,
  "stock": 25,
  "imagePath": "/images/galaxy-s24-ultra.jpg",
  "categoryId": 1
}
```

**Respuesta exitosa (200)**:
```json
{
  "id": 2,
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Smartphone Samsung premium",
  "value": "1199.99",
  "stock": 25,
  "imagePath": "/images/galaxy-s24-ultra.jpg",
  "categoryId": 1,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T01:00:00.000Z"
}
```

### DELETE /api/products/:id
Elimina un producto.

**URL**: `DELETE /api/products/{id}`

**Respuesta exitosa (200)**:
```json
{
  "message": "Product successfully removed"
}
```

---

## 🔐 Roles

### GET /api/roles
Obtiene todos los roles del sistema.

**URL**: `GET /api/roles`

**Cache**: ✅ TTL: 300 segundos

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "admin",
    "description": "Administrador del sistema",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "user",
    "description": "Usuario regular",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### GET /api/roles/:id
Obtiene un rol específico.

**URL**: `GET /api/roles/{id}`

**Cache**: ✅ TTL: 300 segundos

**Respuesta exitosa (200)**:
```json
{
  "id": 1,
  "name": "admin",
  "description": "Administrador del sistema",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### POST /api/roles
Crea un nuevo rol.

**URL**: `POST /api/roles`

**Body**:
```json
{
  "name": "moderator",
  "description": "Moderador del sistema"
}
```

**Respuesta exitosa (201)**:
```json
{
  "id": 3,
  "name": "moderator",
  "description": "Moderador del sistema",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errores**:
- `400`: Role name is required
- `400`: Role name already exists

### PUT /api/roles/:id
Actualiza un rol existente.

**URL**: `PUT /api/roles/{id}`

**Body**:
```json
{
  "name": "super_admin",
  "description": "Super administrador del sistema"
}
```

**Respuesta exitosa (200)**:
```json
{
  "id": 1,
  "name": "super_admin",
  "description": "Super administrador del sistema",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T01:00:00.000Z"
}
```

### DELETE /api/roles/:id
Elimina un rol.

**URL**: `DELETE /api/roles/{id}`

**Respuesta exitosa (200)**:
```json
{
  "message": "Role deleted successfully"
}
```

---

## 📝 Registro (Auth - Básico)

### POST /api/register
Endpoint básico de registro (implementación inicial).

**URL**: `POST /api/register`

**Body**:
```json
{
  "name": "Carlos Mendoza",
  "email": "carlos@example.com",
  "phone": "+1234567890",
  "password": "securepassword"
}
```

**Respuesta exitosa (201)**:
```json
{
  "user_id": 1234,
  "name": "Carlos Mendoza",
  "email": "carlos@example.com",
  "phone": "+1234567890"
}
```

**Error (400)**:
```json
{
  "error": "Faltan campos requeridos"
}
```

**Nota**: Este endpoint está incompleto y no se integra con la base de datos. Es solo un mock de respuesta.

---

## 🚨 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

## 🔧 Middleware Implementado

### Cache Middleware
- **Redis**: Sistema de cache para mejorar performance
- **Invalidación**: Automática en operaciones CRUD
- **TTL**: Variable según el tipo de endpoint

### Error Handler
- **Async Handler**: Manejo automático de errores asíncronos
- **HttpError**: Clase personalizada para errores HTTP
- **Global Handler**: Captura todos los errores no manejados

## 📊 Resumen de Endpoints

| Método | Endpoint | Descripción | Cache |
|--------|----------|-------------|-------|
| GET | `/` | Health check | ❌ |
| GET | `/api/users` | Listar usuarios | ✅ |
| GET | `/api/users/:id` | Obtener usuario | ✅ |
| POST | `/api/users` | Crear usuario | ❌ |
| PUT | `/api/users/:id` | Actualizar usuario | ❌ |
| DELETE | `/api/users/:id` | Eliminar usuario | ❌ |
| GET | `/api/categories` | Listar categorías | ✅ |
| GET | `/api/categories/with-products` | Categorías con productos | ✅ |
| GET | `/api/categories/:id` | Obtener categoría | ✅ |
| POST | `/api/categories` | Crear categoría | ❌ |
| PUT | `/api/categories/:id` | Actualizar categoría | ❌ |
| DELETE | `/api/categories/:id` | Eliminar categoría | ❌ |
| GET | `/api/products` | Listar productos | ✅ |
| GET | `/api/products/:id` | Obtener producto | ✅ |
| POST | `/api/products` | Crear producto | ❌ |
| PUT | `/api/products/:id` | Actualizar producto | ❌ |
| DELETE | `/api/products/:id` | Eliminar producto | ❌ |
| GET | `/api/roles` | Listar roles | ✅ |
| GET | `/api/roles/:id` | Obtener rol | ✅ |
| POST | `/api/roles` | Crear rol | ❌ |
| PUT | `/api/roles/:id` | Actualizar rol | ❌ |
| DELETE | `/api/roles/:id` | Eliminar rol | ❌ |
| POST | `/api/register` | Registro básico | ❌ |

**Total de Endpoints**: 22 endpoints funcionales