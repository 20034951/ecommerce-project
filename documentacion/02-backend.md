# Backend API - Documentación Técnica

## Resumen

El backend es una API REST construida con Node.js + Express que provee todos los servicios necesarios para la plataforma de ecommerce. Utiliza MySQL como base de datos principal y Redis para cache y sesiones.

## Stack Tecnológico

### Dependencias Principales
```json
{
  "bcryptjs": "^3.0.2",          // Hashing de contraseñas
  "cors": "^2.8.5",              // Cross-Origin Resource Sharing
  "dotenv": "^17.2.3",           // Variables de entorno
  "express": "^5.1.0",           // Framework web
  "jsonwebtoken": "^9.0.2",      // JWT para autenticación
  "mysql2": "^3.15.2",           // Driver MySQL
  "redis": "^5.8.3",             // Cliente Redis
  "resend": "^6.1.2",            // Servicio de emails
  "sequelize": "^6.37.7",        // ORM para MySQL
  "uuid": "^13.0.0"              // Generador UUID
}
```

### Dependencias de Desarrollo
```json
{
  "@babel/core": "^7.28.4",      // Transpilador JavaScript
  "babel-jest": "^30.2.0",       // Testing con Babel
  "jest": "^30.2.0",             // Framework de testing
  "nodemon": "^3.1.10",          // Hot reload
  "supertest": "^7.1.4"          // HTTP testing
}
```

## Arquitectura del Backend

### Estructura de Directorios
```
backend/src/
├── app.js              # Punto de entrada principal
├── seedDatabase.js     # Datos de prueba
├── config/
│   └── db.js          # Configuración Sequelize
├── middleware/
│   ├── auth.js        # Autenticación JWT
│   ├── cache.js       # Middleware de cache
│   ├── errorHandler.js # Manejo de errores
│   └── tokenCleanup.js # Limpieza de tokens
├── models/            # Modelos Sequelize
│   ├── index.js       # Índice de modelos
│   ├── user.js
│   ├── product.js
│   ├── category.js
│   ├── cart.js
│   ├── order.js
│   └── ...
├── routes/            # Endpoints API
│   ├── register.js    # Autenticación
│   ├── user.js        # Usuarios
│   ├── product.js     # Productos
│   ├── category.js    # Categorías
│   ├── customer.js    # Clientes
│   └── passwordReset.js
├── services/          # Lógica de negocio
│   ├── authService.js
│   ├── emailService.js
│   ├── passwordResetService.js
│   ├── ProductService.js
│   └── userService.js
└── utils/             # Utilidades
    ├── asyncHandler.js
    ├── HttpError.js
    ├── Paginator.js
    └── redisClient.js
    └── sendPaginatedResponse.js
```

## Endpoints API

### Autenticación (`/api/auth`)
```http
POST /api/auth/register     # Registro de usuarios
POST /api/auth/login        # Iniciar sesión
POST /api/auth/refresh      # Renovar token
POST /api/auth/logout       # Cerrar sesión
GET  /api/auth/verify       # Verificar token
```

### Reset de Contraseñas (`/api/auth`)
```http
POST /api/auth/forgot-password    # Solicitar reset
POST /api/auth/reset-password     # Confirmar reset
GET  /api/auth/validate-token     # Validar token reset
```

### Usuarios (`/api/users`)
```http
GET    /api/users           # Listar usuarios (Admin)
GET    /api/users/:id       # Usuario por ID
PUT    /api/users/:id       # Actualizar usuario
DELETE /api/users/:id       # Eliminar usuario
GET    /api/users/profile   # Perfil del usuario logueado
PUT    /api/users/profile   # Actualizar perfil
```

### Categorías (`/api/categories`)
```http
GET    /api/categories              # Listar categorías
GET    /api/categories/with-products # Con productos incluidos
GET    /api/categories/:id          # Categoría por ID
POST   /api/categories              # Crear categoría
PUT    /api/categories/:id          # Actualizar categoría
DELETE /api/categories/:id          # Eliminar categoría
```

### Productos (`/api/products`)
```http
GET    /api/products?page=1&limit=5                                             # Listar productos usando paginador
GET    /api/products?page=2&limit=5&sortBy=price&sortOrder=desc                 # Listar productos ordenados por precio de manera descendente
GET    /api/products?page=1&limit=5&category_id=3&name=robot                    # Listar productos pertenecientes a categoría con ID 3 y que su nombre contenga "robot"
GET    ?page=1&limit=5&category_id=3&name=robot&filterMode=or                   # Listar productos pertenecientes a categoría con ID 3 o que su nombre contenga "robot"
GET    /api/products/:id            # Producto por ID
POST   /api/products                # Crear producto
PUT    /api/products/:id            # Actualizar producto
DELETE /api/products/:id            # Eliminar producto
GET    /api/products/category/:id   # Productos por categoría
```

### Clientes (`/api/customers`)
```http
GET    /api/customers           # Listar clientes (Admin)
GET    /api/customers/:id       # Cliente por ID
PUT    /api/customers/:id       # Actualizar cliente
DELETE /api/customers/:id       # Eliminar cliente
```

## Modelos de Base de Datos

### User (Usuarios)
```javascript
{
  user_id: INTEGER (PK),
  name: STRING(100),
  email: STRING(150) UNIQUE,
  password_hash: STRING(255),
  phone: STRING(20),
  role: ENUM('customer', 'admin', 'editor'),
  isActive: BOOLEAN,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Product (Productos)
```javascript
{
  product_id: INTEGER (PK),
  name: STRING(200),
  description: TEXT,
  price: DECIMAL(10,2),
  discount_price: DECIMAL(10,2),
  stock_quantity: INTEGER,
  category_id: INTEGER (FK),
  sku: STRING(50) UNIQUE,
  weight: DECIMAL(5,2),
  dimensions: STRING(100),
  isActive: BOOLEAN,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Category (Categorías)
```javascript
{
  category_id: INTEGER (PK),
  name: STRING(100),
  description: TEXT,
  parent_id: INTEGER (FK),
  isActive: BOOLEAN,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Cart (Carrito)
```javascript
{
  cart_id: INTEGER (PK),
  user_id: INTEGER (FK),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### CartItem (Elementos del Carrito)
```javascript
{
  cart_item_id: INTEGER (PK),
  cart_id: INTEGER (FK),
  product_id: INTEGER (FK),
  quantity: INTEGER,
  created_at: TIMESTAMP
}
```

### Order (Órdenes)
```javascript
{
  order_id: INTEGER (PK),
  user_id: INTEGER (FK),
  total_amount: DECIMAL(10,2),
  status: ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  shipping_address: TEXT,
  payment_method: STRING(50),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

## Middlewares

### 1. Authentication (`middleware/auth.js`)
```javascript
// Verificación de JWT tokens
// Extrae user del token y lo agrega a req.user
// Maneja refresh tokens automáticamente

// Uso:
import { authenticateToken } from '../middleware/auth.js';
router.get('/protected', authenticateToken, handler);
```

### 2. Cache (`middleware/cache.js`)
```javascript
// Cache con Redis para optimizar consultas frecuentes
// TTL configurable por endpoint
// Invalidación automática en operaciones de escritura

// Uso:
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

// Cache de lectura
router.get('/categories', cacheMiddleware('categories:all', 120), handler);

// Invalidación en escritura
await invalidateCache(['categories:all', 'categories:with-products']);
```

### 3. Error Handler (`middleware/errorHandler.js`)
```javascript
// Manejo centralizado de errores
// Logging estructurado
// Respuestas consistentes
// Ocultación de detalles internos en producción

// Respuesta estándar:
{
  "error": {
    "message": "Error message",
    "status": 400,
    "timestamp": "2025-01-01T00:00:00.000Z",
    "path": "/api/endpoint"
  }
}
```

### 4. Token Cleanup (`middleware/tokenCleanup.js`)
```javascript
// Limpieza automática de tokens expirados
// Ejecuta cada request y en background
// Mantiene la base de datos limpia

// Configuración automática:
app.use(tokenCleanup.cleanup);
tokenCleanup.startAutomaticCleanup(); // Cada hora
```

## Servicios

### 1. AuthService (`services/authService.js`)
```javascript
// Funcionalidades:
- generateTokens(user)          // Genera JWT + Refresh token
- verifyToken(token)            // Verifica validez del JWT
- refreshToken(refreshToken)    // Renueva tokens
- hashPassword(password)        // Hash con bcrypt
- comparePassword(password, hash) // Verifica contraseña
```

### 2. EmailService (`services/emailService.js`)
```javascript
// Funcionalidades:
- sendEmail(to, subject, content)     // Envío general
- sendPasswordResetEmail(user, token) // Reset de contraseña
- sendWelcomeEmail(user)             // Bienvenida
- sendOrderConfirmation(user, order)  // Confirmación orden
```

### 3. PasswordResetService (`services/passwordResetService.js`)
```javascript
// Funcionalidades:
- requestReset(email)           // Genera token y envía email
- validateToken(token)          // Verifica token válido
- resetPassword(token, newPassword) // Cambia contraseña
- cleanExpiredTokens()          // Limpieza automática
```

### 4. ProductService (`services/ProductService.js`)
```javascript
// Funcionalidades:
- getAll(query)                 // Genera una lista de productos que cumplan las condiciones del query
- getById(id)                   // Obtiene el detalle del producto relacionado al ID enviado si existe
- create(data)                  // Crea un nuevo producto
- update(id, data)              // Actualiza un producto relacionado al ID enviado sí el registro existe
- delete(id)                    // Actualiza un producto relacionado al ID enviado sí el registro existe
```

## Utilidades

### 1. AsyncHandler (`utils/asyncHandler.js`)
```javascript
// Wrapper para manejo de errores en async/await
// Evita try/catch repetitivo
// Pasa errores al middleware errorHandler

// Uso:
import { asyncHandler } from '../utils/asyncHandler.js';

router.get('/endpoint', asyncHandler(async (req, res) => {
  // Código async sin try/catch
  const data = await Model.findAll();
  res.json(data);
}));
```

### 2. HttpError (`utils/HttpError.js`)
```javascript
// Clase personalizada para errores HTTP
// Integración con errorHandler middleware

// Uso:
import HttpError from '../utils/HttpError.js';

if (!user) {
  throw new HttpError(404, 'Usuario no encontrado');
}
```

### 3. RedisClient (`utils/redisClient.js`)
```javascript
// Cliente Redis configurado
// Manejo de conexión y errores
// Funciones helper para cache

// Funcionalidades:
- initRedis()              // Inicialización
- getCache(key)            // Obtener del cache
- setCache(key, value, ttl) // Guardar en cache
- deleteCache(key)         // Eliminar del cache
- clearCache()             // Limpiar todo
```

### 4. Paginator (`utils/Paginator.js`)
```javascript



// Utilidad para manejar paginación, ordenamiento y filtros dinámicos de manera
// reutilizable en endpoints que utilizan Sequelize. Extrae parámetros desde
// req.query, valida valores y construye automáticamente los objetos necesarios
// (limit, offset, order, where).

---

## Funcionalidades

  - constructor(query)    // Inicializa paginación, ordenamiento, filtros y modo de filtrado. 
  - allowSort(fields)     // Define los campos permitidos para ordenar. |
  - allowFilter(fields)    // Define los campos permitidos para filtrar.
- validateSort()          // Valida y corrige sortBy si no está permitido.
  - buildFilters()        // Construye dinámicamente el objeto where (LIKE, exacto, numérico). 
  - build()               // Genera el objeto final para Sequelize (limit, offset, order, where, metadata).
 

## Parámetros aceptados desde req.query

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| page | number | 1 | Número de página (1-based). |
| limit | number | 10 | Elementos por página. |
| sortBy | string | created_at | Campo para ordenar. |
| sortOrder | string ('asc' | 'desc') | ASC | Dirección del orden. |
| filterMode | string ('and' | 'or') | and | Cómo combinar filtros múltiples. |
 
// Todos los demás parámetros del query pueden ser usados como filtros si fueron definidos con allowFilter.


## Reglas de filtrado (buildFilters)
 
// La construcción de condiciones where se basa en las siguientes reglas:
 
1. **Campo `name`**: búsqueda parcial con LIKE '%valor%'
2. **Strings que representan números**: se convierten a Number para coincidencia exacta
3. **Otros valores**: coincidencia exacta
4. **Valores vacíos**: se ignoran
5. **Modo de combinación**:
   - filterMode = 'and' (por defecto) → { [Op.and]: [condiciones...] }
   - filterMode = 'or' → { [Op.or]: [condiciones...] }
 

### Ejemplo de query
 ?name=John&status=active&age=30
 
### Resultado esperado (condiciones)
[
  { name: { [Op.like]: '%John%' } },
  { status: 'active' },
  { age: 30 }
]
 
 
## Ordenamiento (validateSort)
 
- sortBy se valida contra allowedSort.  
- Si sortBy no está permitido, se reemplaza por el primer campo de allowedSort.  
- sortOrder se normaliza a ASC o DESC.
 
 
## Resultado final (build)
 
 // El método build() retorna un objeto listo para Model.findAndCountAll() o Model.findAll():
 
{
  limit: number,
  offset: number,
  order: [[sortBy, sortOrder]],
  where: object,
  page: number,
  sortBy: string,
  sortOrder: 'ASC' | 'DESC',
  filterMode: 'and' | 'or'
}
 

## Ejemplo de uso en un endpoint Express

import Paginator from '../utils/paginator.js';
import { Product } from '../models';
 
router.get('/products', async (req, res) => {
    const paginator = new Paginator(req.query)
        .allowSort(['name', 'price', 'created_at'])
        .allowFilter(['name', 'category_id', 'price', 'status']);
 
    const options = paginator.build();
 
    const result = await Product.findAndCountAll(options);
 
    res.json({
        items: result.rows,
        total: result.count,
        page: options.page,
        limit: options.limit,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        filterMode: options.filterMode
    });
});
 
---
 
## Ejemplo: Filtro OR entre campos
 
// GET /users?name=ana&email=gmail&filterMode=or
const paginator = new Paginator(req.query)
    .allowSort(['created_at'])
    .allowFilter(['name', 'email']);
 
const options = paginator.build();
// where => { [Op.or]: [ { name: { [Op.like]: '%ana%' } }, { email: { [Op.like]: '%gmail%' } } ] }

 
## Ejemplo: validación de sort
 

// GET /products?sortBy=unknown
const paginator = new Paginator(req.query)
    .allowSort(['name', 'price']);
 
const { order } = paginator.build();
// order se ajustará a [['name', 'ASC']] si 'unknown' no está permitido

 
## Beneficios
 
- Reutilizable en múltiples endpoints
- Evita duplicación de lógica de paginación/filtros
- Previene ordenamientos o filtros no autorizados
- Integración nativa con Sequelize (Op.and, Op.or, Op.like)
- Manejo de modos de filtro flexibles (and / or)
- Devuelve metadatos útiles para respuestas paginadas
 
 
## Recomendaciones para uso en la API
 
Se sugiere combinar esta clase con el helper sendPaginatedResponse() para mantener respuestas consistentes:
 

sendPaginatedResponse(res, result.rows, result.count, options);

 
Este helper suele devolver:
- items
- total
- page
- totalPages
- limit
- sortBy
- sortOrder
- filterMode
 
## Estructura del archivo
 
```
utils/
└── Paginator.js
```
 
 
## Próximas mejoras sugeridas (opcional)

- Soporte para filtros por rango (price_min, price_max)
- Soporte para incluir relaciones (include)
- Validación automática de tipos (string, number, boolean)
 
 
## Conclusión
 
Clase limpia y reutilizable para gestionar paginación, ordenamiento y filtros en APIs basadas en Sequelize.
Evita repetir lógica en controladores y facilita respuestas paginadas consistentes.

```

## Configuración

### Variables de Entorno Requeridas
```bash
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=ecommerce_user
DB_PASS=ecommerce_p4zzW0rD
DB_NAME=ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Email
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourstore.com

# Aplicación
NODE_ENV=development
PORT=5005
FRONTEND_ADMIN_URL=http://localhost:3001
```

### Configuración de Base de Datos (`config/db.js`)
```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ecommerce',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
```

## Testing

### Estructura de Tests
```
backend/tests/
├── setup.js           # Configuración global de tests
├── user.test.js       # Tests de usuarios
├── category.test.js   # Tests de categorías
├── product.test.js    # Tests de productos
├── role.test.js       # Tests de roles
└── passwordReset.test.js # Tests de reset
```

### Configuración Jest (`jest.config.cjs`)
```javascript
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Comandos de Testing
```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm run test:coverage
```

## Seguridad

### Medidas Implementadas
1. **Password Hashing**: bcrypt con 10 salt rounds
2. **JWT Security**: Tokens firmados con secret robusto
3. **CORS**: Configuración restrictiva de orígenes
4. **SQL Injection**: Prevención vía ORM Sequelize
5. **Rate Limiting**: Control de peticiones por IP (preparado)
6. **Input Validation**: Sanitización en rutas críticas
7. **Error Handling**: Sin exposición de stack traces

### Autenticación JWT
```javascript
// Token structure
{
  "header": {
    "typ": "JWT",
    "alg": "HS256"
  },
  "payload": {
    "user_id": 123,
    "email": "user@example.com",
    "role": "customer",
    "iat": 1640995200,
    "exp": 1640996100
  }
}

// Refresh token: UUID almacenado en base de datos
// Expires: 7 días por defecto
```

## Performance y Optimización

### Cache Strategy
- **Redis TTL**: 120 segundos para consultas frecuentes
- **Cache Keys**: Estructura jerárquica ('categories:all', 'product:123')
- **Invalidación**: Automática en operaciones de escritura
- **Fallback**: Graceful degradation si Redis falla

### Database Optimization
- **Índices**: En campos frecuentemente consultados
- **Lazy Loading**: Asociaciones cargadas bajo demanda
- **Connection Pool**: Máximo 10 conexiones concurrentes
- **Query Optimization**: Uso eficiente de Sequelize

### Monitoring
- **Health Check**: Endpoint `/` con status
- **Structured Logging**: JSON format para análisis
- **Error Tracking**: Logs centralizados con contexto
- **Performance Metrics**: Tiempo de respuesta por endpoint

## Desarrollo

### Scripts Disponibles
```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm test         # Ejecutar tests
npm run seed     # Poblar base de datos (POST /api/seed)
```

### Hot Reload
- **Nodemon**: Reinicio automático en cambios
- **Babel**: Transpilación ES6+ para compatibilidad
- **Environment**: Carga automática de variables

### Debug
```bash
# Habilitar debug de Sequelize
DEBUG=sequelize:* npm run dev

# Debug completo
DEBUG=* npm run dev
```