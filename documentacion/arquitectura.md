# Arquitectura del Proyecto Ecommerce

## Descripción General

Este proyecto es una plataforma de ecommerce construida con una arquitectura de microservicios containerizada con Docker. La plataforma consta de múltiples servicios que trabajan en conjunto para proporcionar funcionalidades de comercio electrónico.

## Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend Store │    │ Frontend Admin  │    │    phpMyAdmin   │
│   (React)       │    │   (React)       │    │   (Web GUI)     │
│   Puerto: 3000  │    │   Puerto: 3001  │    │   Puerto: 8080  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
              ┌─────────────────────────────────┐
              │         Backend API             │
              │       (Node.js/Express)         │
              │        Puerto: 5005             │
              └─────────────────────────────────┘
                                  │
                   ┌──────────────┼──────────────┐
                   │              │              │
         ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
         │     MySQL       │  │     Redis       │  │   Base de Datos │
         │   (Base Datos)  │  │    (Cache)      │  │  Inicialización │
         │   Puerto: 3306  │  │   Puerto: 6379  │  │     (SQL)       │
         └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Stack Tecnológico

#### Backend
- **Framework**: Node.js con Express
- **ORM**: Sequelize
- **Base de Datos**: MySQL 8.0
- **Cache**: Redis 7.4
- **Autenticación**: Sin implementar (solo registro básico)
- **Documentación**: Sin swagger (documentado manualmente)

#### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: React Scripts 5.0.1
- **Styling**: CSS básico
- **Testing**: Jest + React Testing Library

#### Infraestructura
- **Containerización**: Docker & Docker Compose
- **Base Image**: Node.js 20
- **Orquestación**: Docker Compose
- **Reverse Proxy**: No implementado
- **Load Balancer**: No implementado

## Servicios y Puertos

### Servicios en Ejecución

| Servicio | Puerto | Descripción | Estado |
|----------|--------|-------------|--------|
| **Backend API** | 5005 | API REST principal | ✅ Funcional |
| **Frontend Store** | 3000 | Tienda para clientes | ✅ Funcional |
| **Frontend Admin** | 3001 | Panel administrativo | 🟡 Básico |
| **MySQL** | 3306 | Base de datos principal | ✅ Funcional |
| **Redis** | 6379 | Sistema de cache | ✅ Funcional |
| **phpMyAdmin** | 8080 | Administración de BD | ✅ Funcional |

### Configuración de Red

- **Red Docker**: Todos los servicios comparten la misma red Docker
- **Persistencia**: Volúmenes para MySQL (`mysql_data`) y Redis (`redis_data`)
- **Variables de Entorno**: Configuradas via archivo `.env`

## Estructura de Base de Datos

### Entidades Principales

```sql
-- Roles del sistema
roles (id, name, description, createdAt, updatedAt)

-- Usuarios del sistema
users (id, name, username, email, password, isActive, createdAt, updatedAt)

-- Relación usuarios-roles (muchos a muchos)
UserRoles (userId, roleId, createdAt, updatedAt)

-- Categorías de productos
Categories (id, name, description, createdAt, updatedAt)

-- Productos
Products (id, name, description, value, stock, imagePath, categoryId, createdAt, updatedAt)
```

### Relaciones

- **Users ↔ Roles**: Relación muchos a muchos a través de `UserRoles`
- **Categories → Products**: Relación uno a muchos
- **Products → Categories**: Cada producto pertenece a una categoría

## Patrones de Diseño Implementados

### Backend
1. **Repository Pattern**: Implementado a través de Sequelize models
2. **Service Layer**: Separación de lógica de negocio en servicios
3. **Middleware Pattern**: Manejo de errores y cache
4. **Async/Await Pattern**: Manejo asíncrono con async handlers

### Cache Strategy
- **Cache-Aside Pattern**: Implementado con Redis
- **TTL (Time To Live)**: 120-300 segundos según el endpoint
- **Cache Invalidation**: Invalidación automática en operaciones CRUD

## Arquitectura de Seguridad

### Estado Actual
- ❌ **Autenticación**: No implementada (solo registro)
- ❌ **Autorización**: No implementada
- ❌ **JWT Tokens**: No implementados
- ❌ **Password Hashing**: No implementado
- ❌ **CORS**: Configurado pero permisivo
- ❌ **Rate Limiting**: No implementado
- ❌ **Input Validation**: Básica

### Recomendaciones de Seguridad
1. Implementar autenticación JWT
2. Hash de contraseñas con bcrypt
3. Validación de entrada robusta
4. Implementar roles y permisos
5. Rate limiting en endpoints
6. HTTPS en producción

## Performance y Escalabilidad

### Optimizaciones Actuales
- ✅ **Cache Redis**: Implementado para consultas frecuentes
- ✅ **Database Indexing**: A través de Sequelize
- ✅ **Connection Pooling**: Configurado en Sequelize

### Limitaciones Actuales
- ❌ **Load Balancing**: No implementado
- ❌ **Database Clustering**: Single instance
- ❌ **CDN**: No configurado
- ❌ **Monitoring**: No implementado
- ❌ **Logging**: Básico

## Configuración de Desarrollo

### Comandos Principales
```bash
# Levantar todos los servicios
docker compose up --build

# Solo backend
docker compose up backend mysql redis

# Logs de un servicio específico
docker compose logs -f backend
```

### Variables de Entorno Requeridas
```env
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
NODE_ENV=development
PORT=5005
```

## Estado del Proyecto y Próximos Pasos

### Funcionalidades Completadas ✅
- CRUD completo para Categories, Products, Users, Roles
- Sistema de cache con Redis
- Containerización completa
- Base de datos relacional configurada
- Testing básico configurado

### En Desarrollo 🟡
- Frontend Store (solo registro de usuarios)
- Frontend Admin (estructura básica)

### Pendientes por Implementar ❌
- Sistema de autenticación y autorización
- Panel de administración completo
- Carrito de compras
- Sistema de pedidos
- Gestión de inventario
- Notificaciones
- Reportes y analytics
- Sistema de pagos

### Deuda Técnica
1. **Seguridad**: Implementar autenticación completa
2. **Validación**: Validación robusta de datos de entrada
3. **Testing**: Ampliar cobertura de tests
4. **Documentación**: API documentation con Swagger
5. **Monitoring**: Implementar logging y métricas
6. **Error Handling**: Mejorar manejo de errores

## Métricas del Proyecto

- **Líneas de Código Backend**: ~1000 líneas
- **Endpoints**: 15 endpoints funcionales
- **Modelos de Datos**: 5 entidades principales
- **Cobertura de Tests**: ~30%
- **Tiempo de Startup**: ~30 segundos (con dependencias)
- **Servicios Docker**: 6 contenedores