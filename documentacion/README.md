# Documentación del Proyecto Ecommerce

## Índice

1. [Arquitectura del Sistema](./01-arquitectura.md)
2. [Backend API](./02-backend.md)
3. [Frontend Admin](./03-frontend-admin.md)
4. [Frontend Store](./04-frontend-store.md)
5. [Guía de Docker](./05-docker.md)
6. [Variables de Entorno](./06-variables-entorno.md)
7. [Base de Datos](./07-base-datos.md)
8. [Testing](./08-testing.md)
9. [Deployment](./09-deployment.md)

## Resumen Ejecutivo

Este proyecto es una plataforma de ecommerce completa construida con arquitectura de microservicios y tecnologías modernas:

- **Backend**: Node.js + Express + MySQL + Redis
- **Frontend Store**: React + Vite + TailwindCSS (Tienda para clientes)
- **Frontend Admin**: React + Vite + TailwindCSS (Panel administrativo)
- **Infraestructura**: Docker + Docker Compose
- **Base de Datos**: MySQL 8.0 con phpMyAdmin
- **Cache**: Redis 7.4

## Estructura General del Proyecto

```
ecommerce-project/
├── backend/                 # API REST con Node.js
│   ├── src/
│   │   ├── config/         # Configuración DB
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Endpoints API
│   │   ├── services/       # Lógica de negocio
│   │   ├── middleware/     # Middlewares personalizados
│   │   └── utils/          # Utilidades y helpers
│   ├── tests/              # Tests unitarios
│   └── db/                 # Scripts SQL
├── frontend-store/         # Aplicación React para clientes
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── modules/        # Módulos por funcionalidad
│       ├── layouts/        # Layouts base
│       └── api/            # Cliente API
├── frontend-admin/         # Panel administrativo React
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── modules/        # Módulos por funcionalidad
│       ├── layouts/        # Layouts base
│       └── api/            # Cliente API
├── documentacion/          # Documentación del proyecto
├── docker-compose.yml      # Configuración Docker
└── .env                    # Variables de entorno
```

## Características Principales

### Funcionalidades del Sistema
- ✅ Autenticación y autorización JWT
- ✅ Gestión de usuarios y roles
- ✅ Catálogo de productos y categorías
- ✅ Carrito de compras
- ✅ Sistema de órdenes
- ✅ Panel administrativo completo
- ✅ Cache con Redis
- ✅ Reset de contraseñas por email
- ✅ API REST documentada
- ✅ Contenedorización con Docker

### Tecnologías Utilizadas

#### Backend
- **Node.js 20+**: Runtime de JavaScript
- **Express 5**: Framework web
- **Sequelize 6**: ORM para MySQL
- **MySQL 8.0**: Base de datos relacional
- **Redis 7.4**: Sistema de cache
- **JWT**: Autenticación stateless
- **Bcrypt**: Hash de contraseñas
- **Resend**: Servicio de emails
- **Jest**: Testing framework

#### Frontend
- **React 19**: Librería UI
- **Vite 5**: Build tool y dev server
- **React Router 7**: Routing SPA
- **TanStack Query**: Estado del servidor
- **TailwindCSS 4**: Framework CSS
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de schemas
- **Lucide React**: Iconos

#### DevOps
- **Docker & Docker Compose**: Contenedorización
- **phpMyAdmin**: Administración MySQL
- **Nodemon**: Hot reload desarrollo
- **ESLint**: Linting JavaScript
- **Prettier**: Formateo código

## Enlaces Rápidos

- [Configuración inicial](./05-docker.md#configuración-inicial)
- [Variables de entorno](./06-variables-entorno.md)
- [API Endpoints](./02-backend.md#endpoints)
- [Guía de desarrollo](./09-deployment.md#desarrollo)