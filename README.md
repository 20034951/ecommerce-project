# Proyecto Ecommerce

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Plataforma de ecommerce completa con arquitectura moderna y escalable

## 🚀 Características Principales

- ✅ **Backend API REST** con Node.js + Express + MySQL
- ✅ **Frontend Tienda** para clientes (React + Vite + TailwindCSS)
- ✅ **Panel Administrativo** completo (React + TanStack Query)
- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Sistema de Cache** con Redis
- ✅ **Contenedorización** completa con Docker
- ✅ **Base de Datos** MySQL con esquema optimizado
- ✅ **Testing** integrado (Jest + Vitest)
- ✅ **Documentación** comprehensiva

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     DOCKER NETWORK                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Frontend     │  │Frontend     │  │phpMyAdmin   │        │
│  │Store        │  │Admin        │  │:8080        │        │
│  │:3000        │  │:3001        │  └─────────────┘        │
│  └─────────────┘  └─────────────┘                         │
│         │                │                                 │
│         └────────────────┼─────────────────┐               │
│                          │                 │               │
│  ┌─────────────────────────────────────────▼─────────────┐ │
│  │                Backend API :5005                     │ │
│  │           Node.js + Express + Sequelize              │ │
│  └─────────────────┬─────────────────┬─────────────────┘ │
│                    │                 │                   │
│  ┌─────────────────▼───┐  ┌─────────▼──────┐             │
│  │    MySQL :3306     │  │  Redis :6379   │             │
│  │   Base de Datos    │  │     Cache      │             │
│  └────────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Node.js 20+** (para desarrollo sin Docker)
- **MySQL 8.0** (para desarrollo local)
- **Git** para control de versiones

## ⚡ Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ecommerce-project.git
cd ecommerce-project
```

### 2. Configurar Variables de Entorno

```bash
# Copiar plantilla de variables de entorno
cp .env.example .env

# Editar .env con tu configuración
nano .env  # o tu editor preferido
```

### 3. Iniciar con Docker

```bash
# Iniciar todos los servicios
docker compose up --build

# En segundo plano
docker compose up -d --build
```

### 4. Acceder a los Servicios

- 🛍️ **Tienda**: http://localhost:3000
- ⚙️ **Panel Admin**: http://localhost:3001
- 🔧 **API Backend**: http://localhost:5005
- 🗄️ **phpMyAdmin**: http://localhost:8080
- 📊 **Base de Datos**: localhost:3308

## 📚 Documentación Completa

### 📖 Guías Principales

| Documento                                                     | Descripción                                        |
| ------------------------------------------------------------- | -------------------------------------------------- |
| **[🏗️ Arquitectura](./documentacion/01-arquitectura.md)**     | Visión general del sistema, componentes y patrones |
| **[🔧 Backend API](./documentacion/02-backend.md)**           | Documentación completa del API REST                |
| **[👨‍💼 Frontend Admin](./documentacion/03-frontend-admin.md)** | Panel administrativo y sus funcionalidades         |
| **[🛍️ Frontend Store](./documentacion/04-frontend-store.md)** | Tienda online y experiencia del cliente            |

### 🚀 Operaciones y Desarrollo

| Documento                                                              | Descripción                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| **[🐳 Docker](./documentacion/05-docker.md)**                          | Guía completa de contenedores y despliegue     |
| **[⚙️ Variables de Entorno](./documentacion/06-variables-entorno.md)** | Configuración detallada de todas las variables |
| **[🗄️ Base de Datos](./documentacion/07-base-datos.md)**               | Esquema, modelos y optimizaciones              |
| **[🧪 Testing](./documentacion/08-testing.md)**                        | Estrategias de testing y guías                 |
| **[🚀 Deployment](./documentacion/09-deployment.md)**                  | Despliegue en producción y CI/CD               |

### 📂 Estructura del Proyecto

```
ecommerce-project/
├── 📁 backend/              # API REST Node.js
│   ├── src/                 # Código fuente
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Endpoints API
│   │   ├── services/       # Lógica de negocio
│   │   └── middleware/     # Middlewares personalizados
│   └── tests/              # Tests unitarios
├── 📁 frontend-store/       # Tienda React
│   └── src/
│       ├── modules/        # Módulos funcionales
│       ├── components/     # Componentes reutilizables
│       └── api/           # Cliente API
├── 📁 frontend-admin/       # Panel Admin React
│   └── src/
│       ├── modules/        # Módulos de administración
│       ├── components/     # Componentes UI
│       └── layouts/       # Layouts principales
├── 📁 documentacion/        # Documentación del proyecto
├── 📄 docker-compose.yml    # Configuración Docker
├── 📄 .env.example         # Plantilla variables entorno
└── 📄 README.md            # Este archivo
```

## 🔑 Tecnologías Utilizadas

### Backend

- **Node.js 20** - Runtime JavaScript
- **Express 5** - Framework web
- **Sequelize 6** - ORM para MySQL
- **MySQL 8.0** - Base de datos relacional
- **Redis 7.4** - Sistema de cache
- **JWT** - Autenticación stateless
- **Jest** - Framework de testing

### Frontend

- **React 19** - Librería UI
- **Vite 5** - Build tool moderno
- **TailwindCSS 4** - Framework CSS utility-first
- **React Router 7** - Routing SPA
- **TanStack Query 5** - Estado del servidor
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de schemas

### DevOps

- **Docker & Docker Compose** - Contenedorización
- **GitHub Actions** - CI/CD (preparado)
- **ESLint & Prettier** - Calidad de código
- **Vitest** - Testing frontend

## 🛠️ Comandos Principales

### Desarrollo

```bash
# Iniciar desarrollo completo
docker compose up --build

# Solo backend
docker compose up backend mysql redis -d

# Ver logs en tiempo real
docker compose logs -f backend

# Ejecutar tests
docker compose exec backend npm test

# Acceder al contenedor
docker compose exec backend sh
```

### Producción

```bash
# Desplegar en producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verificar servicios
docker compose ps

# Backup base de datos
docker compose exec mysql mysqldump -u root -p ecommerce > backup.sql
```

## 🧪 Testing

### Backend (Jest)

```bash
# Ejecutar todos los tests
cd backend && npm test

# Tests con coverage
npm run test:coverage

# Tests específicos
npm test -- --testPathPattern=user.test.js
```

### Frontend (Vitest)

```bash
# Frontend Admin
cd frontend-admin && npm test

# Frontend Store
cd frontend-store && npm test

# UI de testing
npm run test:ui
```

## 📊 Métricas del Proyecto

- **Líneas de código**: ~15,000+
- **Tests**: 50+ casos de prueba
- **Coverage**: >80% en componentes críticos
- **Servicios**: 6 contenedores Docker
- **Endpoints API**: 25+ rutas documentadas
- **Componentes React**: 40+ componentes reutilizables

## 🤝 Contribución

1. **Fork** el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir **Pull Request**

### Convenciones de Commits

- `Add:` Nueva funcionalidad
- `Fix:` Corrección de bugs
- `Update:` Mejoras o cambios
- `Remove:` Eliminación de código
- `Docs:` Cambios en documentación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Gestión de Ordenes

- Endpoints de Órdenes (/api/orders)
  ➕ Crear una orden
  POST /api/orders
  Crea una nueva orden en estado pending.
  Requiere un token JWT válido de un usuario autenticado.
  Headers:
  Content-Type: application/json
  Authorization: Bearer <accessToken>

## Actualizar estado de una orden y notificar al cliente

PUT /api/orders/:id/status

Actualiza el estado de una orden (pending, paid, shipped, delivered, cancelled)
y envía automáticamente un correo electrónico al cliente informando el cambio.

Headers
Content-Type: application/json
Authorization: Bearer <accessTokenAdmin>

Requisitos

Solo los usuarios con role = 'admin' pueden actualizar el estado.
El correo se envía usando el servicio Resend API, configurado en emailService.js.

## ⚙️ Configuración del servicio de correo

Archivo: backend/src/services/emailService.js
Variables de entorno requeridas:
RESEND_API_KEY=tu_api_key_resend
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

Los modelos Order y OrderItem se importan desde models/index.js,
que expone todas las asociaciones y evita el uso directo de config/db.js.

El middleware requireAdmin restringe la actualización de estado a usuarios administradores.

El correo se genera automáticamente desde orderService.js usando emailService.sendOrderStatusEmail(...).

---

⭐ **¡Si este proyecto te resulta útil, considera darle una estrella!** ⭐
