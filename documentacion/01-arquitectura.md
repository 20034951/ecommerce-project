# Arquitectura del Sistema

## Visión General

El proyecto Ecommerce sigue una arquitectura de microservicios contenedorizada que separa claramente las responsabilidades entre frontend, backend y servicios de datos. La comunicación se realiza a través de APIs REST y el sistema está diseñado para ser escalable y mantenible.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Frontend Store │  │  Frontend Admin │  │    phpMyAdmin   │ │
│  │    (React)      │  │     (React)     │  │   (MySQL GUI)   │ │
│  │   Port: 3000    │  │    Port: 3001   │  │   Port: 8080    │ │
│  └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘ │
│            │                    │                    │         │
│            └────────────────────┼────────────────────┘         │
│                                 │                              │
│  ┌─────────────────────────────┴─────────────────────────────┐ │
│  │                    Backend API                            │ │
│  │                 (Node.js + Express)                      │ │
│  │                    Port: 5005                            │ │
│  └─────────────────┬─────────────────┬─────────────────────┘ │
│                    │                 │                       │
│  ┌─────────────────┴───────┐  ┌─────┴──────┐                │
│  │        MySQL            │  │   Redis    │                │
│  │     (Database)          │  │  (Cache)   │                │
│  │      Port: 3306         │  │ Port: 6379 │                │
│  └─────────────────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes del Sistema

### 1. Frontend Store (Tienda)
- **Tecnología**: React 19 + Vite 5
- **Puerto**: 3000
- **Responsabilidad**: Interfaz para clientes finales
- **Funcionalidades**:
  - Navegación de productos
  - Carrito de compras
  - Checkout y pagos
  - Gestión de perfil de usuario
  - Historial de órdenes

### 2. Frontend Admin (Panel Administrativo)
- **Tecnología**: React 19 + Vite 5
- **Puerto**: 3001
- **Responsabilidad**: Interfaz para administradores
- **Funcionalidades**:
  - Gestión de productos y categorías
  - Administración de usuarios
  - Dashboard con métricas
  - Gestión de órdenes
  - Configuración del sistema

### 3. Backend API
- **Tecnología**: Node.js 20 + Express 5
- **Puerto**: 5005
- **Responsabilidad**: Lógica de negocio y API REST
- **Funcionalidades**:
  - Autenticación JWT
  - CRUD de entidades
  - Validación de datos
  - Integración con servicios externos
  - Cache con Redis

### 4. Base de Datos MySQL
- **Tecnología**: MySQL 8.0
- **Puerto**: 3306 (interno), 3308 (externo)
- **Responsabilidad**: Persistencia de datos
- **Características**:
  - Esquema relacional normalizado
  - Índices optimizados
  - Backups automáticos
  - Health checks

### 5. Sistema de Cache Redis
- **Tecnología**: Redis 7.4 Alpine
- **Puerto**: 6379
- **Responsabilidad**: Cache y sesiones
- **Uso**:
  - Cache de consultas frecuentes
  - Almacenamiento de sesiones
  - Rate limiting
  - Tokens de reset

### 6. phpMyAdmin
- **Tecnología**: phpMyAdmin oficial
- **Puerto**: 8080
- **Responsabilidad**: Administración visual de MySQL

## Flujo de Datos

### 1. Autenticación
```
Cliente → Frontend → Backend API → MySQL
                  ↓
                Redis (sesiones)
```

### 2. Operaciones CRUD
```
Cliente → Frontend → Backend API → MySQL
                  ↓           ↑
                Redis Cache ──┘
```

### 3. Reset de Contraseñas
```
Cliente → Frontend → Backend API → Resend API (Email)
                  ↓
                Redis (tokens temporales)
```

## Patrones de Arquitectura Implementados

### 1. Separation of Concerns
- **Frontend**: Solo lógica de presentación
- **Backend**: Solo lógica de negocio y datos
- **Database**: Solo persistencia

### 2. API-First Design
- Todas las funcionalidades expuestas vía REST API
- Documentación OpenAPI/Swagger ready
- Versionado de API preparado

### 3. Stateless Authentication
- JWT para autenticación
- Refresh tokens en cookies httpOnly
- No sesiones server-side

### 4. Caching Strategy
- Cache de consultas en Redis
- TTL configurables
- Invalidación automática

### 5. Error Handling
- Middleware centralizado de errores
- Logging estructurado
- Respuestas consistentes

## Escalabilidad y Performance

### Estrategias Implementadas
1. **Contenedorización**: Fácil escalar horizontalmente
2. **Cache Redis**: Reducir carga en base de datos
3. **Lazy Loading**: Cargar componentes bajo demanda
4. **Query Optimization**: Uso de índices y consultas eficientes
5. **Asset Optimization**: Minificación y compresión

### Métricas de Monitoreo
- **Logs centralizados**: JSON structured logging
- **Health checks**: Para todos los servicios
- **Resource limits**: CPU y memoria limitados
- **Request tracking**: ID de request para trazabilidad

## Seguridad

### Medidas Implementadas
1. **HTTPS Ready**: Preparado para TLS
2. **CORS**: Configuración estricta de orígenes
3. **JWT Security**: Tokens firmados y con expiración
4. **Password Hashing**: bcrypt con salt rounds
5. **SQL Injection**: Prevención vía ORM Sequelize
6. **XSS Protection**: Sanitización de inputs
7. **Rate Limiting**: Control de peticiones por IP

### Variables de Entorno
- Todas las credenciales externalizadas
- Diferentes configuraciones por entorno
- Secrets management preparado

## Consideraciones de Deployment

### Entornos Soportados
- **Desarrollo**: Docker Compose local
- **Testing**: Containers aislados
- **Producción**: Docker Swarm / Kubernetes ready

### CI/CD Ready
- Dockerfiles optimizados para producción
- Multi-stage builds
- Health checks integrados
- Zero-downtime deployment compatible

### Monitoreo y Observabilidad
- Logs estructurados en JSON
- Métricas de aplicación expuestas
- Health endpoints en todos los servicios
- Error tracking centralizado

## Próximos Pasos de Evolución

### Mejoras Técnicas Sugeridas
1. **API Gateway**: Kong o Ambassador
2. **Service Mesh**: Istio para comunicación inter-servicios
3. **Message Queue**: RabbitMQ o Apache Kafka
4. **Monitoring**: Prometheus + Grafana
5. **Tracing**: Jaeger o Zipkin
6. **Search Engine**: Elasticsearch para catálogo
7. **CDN**: Para assets estáticos
8. **Load Balancer**: Nginx o Traefik

### Funcionalidades Futuras
1. **Microservicios adicionales**:
   - Servicio de notificaciones
   - Servicio de pagos
   - Servicio de inventario
   - Servicio de recomendaciones
2. **Integraciones**:
   - Pasarelas de pago
   - Servicios de envío
   - Sistemas de análisis
   - CRM externo