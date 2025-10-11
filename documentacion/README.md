# 📚 Documentación del Proyecto Ecommerce

Bienvenido a la documentación completa del proyecto de ecommerce. Esta documentación proporciona una visión integral del estado actual del proyecto, su arquitectura, funcionalidades y roadmap de desarrollo.

## 📖 Índice de Documentación

### 📋 [Resumen Ejecutivo](./resumen-ejecutivo.md)
Análisis general del proyecto, métricas clave, estado de desarrollo y próximos pasos críticos.

**Incluye:**
- Estado general del proyecto
- Métricas y cobertura funcional
- Análisis de riesgos y oportunidades
- Estimaciones de tiempo y esfuerzo
- Recomendaciones estratégicas

---

### 🏗️ [Arquitectura del Sistema](./arquitectura.md)
Documentación técnica completa de la arquitectura del proyecto, componentes y stack tecnológico.

**Incluye:**
- Diagrama de arquitectura
- Stack tecnológico detallado
- Configuración de servicios
- Patrones de diseño implementados
- Análisis de performance y escalabilidad
- Configuración de desarrollo

---

### 🔌 [API Backend - Endpoints](./endpoints.md)
Documentación completa de todos los endpoints del backend con ejemplos de uso y respuestas.

**Incluye:**
- 22 endpoints documentados
- Ejemplos de request/response
- Códigos de estado HTTP
- Configuración de cache
- Middleware implementado
- Validaciones y errores

**Endpoints disponibles:**
- 👤 **Usuarios**: CRUD + gestión de roles
- 📦 **Productos**: CRUD + relación con categorías  
- 🏷️ **Categorías**: CRUD + productos asociados
- 🔐 **Roles**: CRUD del sistema de permisos
- 📝 **Registro**: Endpoint básico de registro

---

### 💻 [Frontend - Configuración](./frontend.md)
Estado actual y configuración de ambas aplicaciones frontend (Store y Admin).

**Incluye:**
- **Frontend Store**: Configuración, funcionalidades y estado
- **Frontend Admin**: Estructura y roadmap de desarrollo
- Dependencias y scripts disponibles
- Configuración Docker
- Testing y performance
- Recomendaciones de mejora

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)
- Git

### Levantar el Proyecto
```bash
# Clonar el repositorio
git clone [url-repositorio]
cd ecommerce-project

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Levantar todos los servicios
docker compose up --build

# Verificar servicios
curl http://localhost:5005  # Backend API
open http://localhost:3000  # Frontend Store
open http://localhost:3001  # Frontend Admin
open http://localhost:8080  # phpMyAdmin
```

### URLs de Acceso
| Servicio | URL | Estado |
|----------|-----|--------|
| **Backend API** | http://localhost:5005 | ✅ Funcional |
| **Frontend Store** | http://localhost:3000 | 🟡 Parcial |
| **Frontend Admin** | http://localhost:3001 | ❌ Template |
| **phpMyAdmin** | http://localhost:8080 | ✅ Funcional |

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (60%)
- **Backend API**: 22 endpoints funcionales
- **Base de datos**: Esquema completo con 5 entidades
- **Cache**: Redis implementado
- **Containerización**: Docker Compose funcional
- **Testing**: Configuración básica
- **Frontend Store**: Registro de usuarios

### 🟡 En Desarrollo (25%)
- **Frontend Store**: Funcionalidades básicas
- **Validaciones**: Implementación parcial
- **Documentación**: En proceso

### ❌ Pendiente (15%)
- **Autenticación**: JWT no implementado
- **Frontend Admin**: Solo template base
- **Carrito de compras**: No implementado
- **Sistema de pedidos**: No implementado

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **ORM**: Sequelize
- **Base de datos**: MySQL 8.0
- **Cache**: Redis 7.4
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 19.1.1
- **Build tool**: React Scripts 5.0.1
- **Testing**: Jest + React Testing Library
- **Styling**: CSS vanilla

### DevOps
- **Containerización**: Docker + Docker Compose
- **Base images**: Node.js 20, MySQL 8.0, Redis 7.4
- **Persistence**: Docker volumes

---

## 🎯 Roadmap de Desarrollo

### Fase 1: Autenticación (2 semanas)
- [ ] JWT implementation en backend
- [ ] Login/logout en frontends
- [ ] Middleware de autenticación
- [ ] Gestión de sesiones

### Fase 2: Admin Panel (4 semanas)
- [ ] Dashboard básico
- [ ] CRUD de productos
- [ ] CRUD de usuarios
- [ ] Gestión de categorías

### Fase 3: Store Features (3 semanas)
- [ ] Catálogo de productos
- [ ] Carrito de compras
- [ ] Búsqueda y filtros
- [ ] Perfil de usuario

### Fase 4: Orders & Payments (3 semanas)
- [ ] Sistema de pedidos
- [ ] Estados de pedido
- [ ] Integración de pagos
- [ ] Notificaciones

---

## 🔧 Desarrollo Local

### Backend
```bash
cd backend
npm install
npm run dev  # Requiere MySQL y Redis
```

### Frontend Store
```bash
cd frontend-store
npm install
npm start
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm start
```

### Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend-store && npm test
cd frontend-admin && npm test
```

---

## 📝 Contribución

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato, espacios
refactor: reestructuración de código
test: añadir tests
chore: tareas de mantenimiento
```

### Pull Request Process
1. Fork del repositorio
2. Crear rama feature/fix
3. Commits descriptivos
4. Tests actualizados
5. Documentación actualizada
6. PR con descripción detallada

---

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

#### Docker Issues
```bash
# Limpiar contenedores
docker compose down -v
docker system prune -f

# Rebuild completo
docker compose up --build --force-recreate
```

#### Database Issues
```bash
# Acceder a MySQL
docker exec -it ecommerce_mysql mysql -uroot -p

# Reset database
docker compose down -v
docker compose up mysql
```

#### Port Issues
```bash
# Verificar puertos ocupados
netstat -tulpn | grep :3000
netstat -tulpn | grep :5005

# Cambiar puertos en docker-compose.yml si es necesario
```

### Contacto
- **Repositorio**: ecommerce-project
- **Owner**: 20034951
- **Rama actual**: feature/formulario-registro

---

## 📈 Métricas y Analytics

### Líneas de Código
- **Total**: ~1,400 líneas
- **Backend**: ~1,000 líneas (71%)
- **Frontend**: ~200 líneas (14%)
- **Config**: ~200 líneas (15%)

### Endpoints API
- **Total**: 22 endpoints
- **CRUD Users**: 5 endpoints
- **CRUD Products**: 5 endpoints
- **CRUD Categories**: 6 endpoints
- **CRUD Roles**: 5 endpoints
- **Auth**: 1 endpoint

### Test Coverage
- **Backend**: ~30%
- **Frontend**: ~10%
- **Target**: 80%

---

*Documentación actualizada: 11 de octubre de 2025*
*Versión del proyecto: 1.0.0*
*Rama: feature/formulario-registro*