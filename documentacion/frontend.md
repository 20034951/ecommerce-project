# Frontend - Documentación Completa

## Configuración General

El proyecto cuenta con dos aplicaciones React separadas:
- **Frontend Store**: Tienda para clientes (Puerto 3000)
- **Frontend Admin**: Panel administrativo (Puerto 3001)

Ambas aplicaciones comparten la misma base tecnológica pero tienen propósitos diferentes.

---

## 🛍️ Frontend Store

### Información General
- **Puerto**: 3000
- **Framework**: React 19.1.1
- **Propósito**: Interfaz de usuario para clientes
- **Estado**: Funcional (solo registro de usuarios)

### Estructura del Proyecto
```
frontend-store/
├── public/
│   ├── index.html          # HTML base
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots
├── src/
│   ├── App.js              # Componente principal
│   ├── App.css             # Estilos principales
│   ├── index.js            # Punto de entrada
│   ├── index.css           # Estilos globales
│   ├── App.test.js         # Tests principales
│   ├── setupTests.js       # Configuración de tests
│   └── reportWebVitals.js  # Métricas de performance
├── Dockerfile              # Containerización
├── package.json            # Dependencias y scripts
└── README.md               # Documentación básica
```

### Dependencias Principales
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-scripts": "5.0.1",
  "web-vitals": "^2.1.4"
}
```

### Dependencias de Testing
```json
{
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.7.0",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^13.5.0"
}
```

### Funcionalidades Implementadas

#### ✅ Registro de Usuarios
- **Ubicación**: `src/App.js`
- **Endpoint**: `POST /api/users`
- **Campos**:
  - Nombre completo (obligatorio)
  - Nombre de usuario (obligatorio)
  - Correo electrónico (obligatorio, con validación)
  - Contraseña (obligatorio, mínimo 6 caracteres)

#### 🔧 Configuración de API
```javascript
// Detección automática de host
const rawHost = window.location.hostname;
const safeHost = rawHost === "localhost" ? "127.0.0.1" : rawHost;
const API = process.env.REACT_APP_API_BASE || `http://${safeHost}:5005`;
```

**Variables de Entorno Soportadas**:
- `REACT_APP_API_BASE`: URL base de la API (opcional)

### Estado de Funcionalidades

#### ✅ Completadas
- [x] Formulario de registro funcional
- [x] Validación básica de campos
- [x] Manejo de estados de carga
- [x] Manejo de errores de API
- [x] Detección automática de API endpoint
- [x] Interfaz responsive básica
- [x] Feedback visual para usuario

#### 🟡 En Desarrollo
- [ ] Autenticación/Login
- [ ] Dashboard de usuario
- [ ] Catálogo de productos

#### ❌ Por Implementar
- [ ] Carrito de compras
- [ ] Proceso de checkout
- [ ] Historial de pedidos
- [ ] Perfil de usuario
- [ ] Búsqueda de productos
- [ ] Filtros y categorías
- [ ] Sistema de favoritos
- [ ] Reseñas y calificaciones
- [ ] Notificaciones
- [ ] Chat de soporte

### Scripts Disponibles
```bash
# Desarrollo
npm start           # Inicia en modo desarrollo

# Producción
npm run build       # Construye para producción

# Testing
npm test            # Ejecuta tests en modo watch
npm run test -- --coverage  # Tests con cobertura

# Otros
npm run eject       # Expone configuración de webpack
```

### Configuración Docker
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🖥️ Frontend Admin

### Información General
- **Puerto**: 3001
- **Framework**: React 19.1.1
- **Propósito**: Panel de administración
- **Estado**: Estructura básica (solo template de React)

### Estructura del Proyecto
```
frontend-admin/
├── public/
│   ├── index.html          # HTML base
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots
├── src/
│   ├── App.js              # Componente principal (template React)
│   ├── App.css             # Estilos principales
│   ├── index.js            # Punto de entrada
│   ├── index.css           # Estilos globales
│   ├── App.test.js         # Tests principales
│   ├── setupTests.js       # Configuración de tests
│   └── reportWebVitals.js  # Métricas de performance
├── Dockerfile              # Containerización
├── package.json            # Dependencias y scripts
└── README.md               # Documentación básica
```

### Dependencias
Idénticas al Frontend Store:
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-scripts": "5.0.1",
  "web-vitals": "^2.1.4"
}
```

### Estado Actual
- **Componente Principal**: Template por defecto de React
- **Funcionalidad**: Solo muestra el logo de React y enlaces básicos
- **Integración con API**: No implementada

### Funcionalidades Planificadas

#### 🔐 Autenticación y Autorización
- [ ] Login de administradores
- [ ] Gestión de sesiones
- [ ] Roles y permisos
- [ ] Recuperación de contraseña

#### 👥 Gestión de Usuarios
- [ ] Lista de usuarios registrados
- [ ] Crear/editar/eliminar usuarios
- [ ] Asignar roles a usuarios
- [ ] Activar/desactivar cuentas
- [ ] Búsqueda y filtros

#### 📦 Gestión de Productos
- [ ] CRUD completo de productos
- [ ] Carga de imágenes
- [ ] Gestión de stock
- [ ] Categorización
- [ ] Productos destacados
- [ ] Control de precios

#### 🏷️ Gestión de Categorías
- [ ] CRUD de categorías
- [ ] Organización jerárquica
- [ ] Asignación a productos

#### 🛒 Gestión de Pedidos
- [ ] Lista de pedidos
- [ ] Estados de pedidos
- [ ] Seguimiento de envíos
- [ ] Facturación

#### 📊 Dashboard y Reportes
- [ ] Métricas de ventas
- [ ] Usuarios activos
- [ ] Productos más vendidos
- [ ] Gráficos y estadísticas
- [ ] Exportación de datos

#### ⚙️ Configuración del Sistema
- [ ] Configuración general
- [ ] Métodos de pago
- [ ] Configuración de envíos
- [ ] Políticas de la tienda

---

## 🚀 Configuración de Desarrollo

### Requisitos
- Node.js 20+
- npm o yarn
- Docker (para desarrollo containerizado)

### Instalación Local

#### Frontend Store
```bash
cd frontend-store
npm install
npm start
# Aplicación disponible en http://localhost:3000
```

#### Frontend Admin
```bash
cd frontend-admin
npm install
npm start
# Aplicación disponible en http://localhost:3001
```

### Desarrollo con Docker
```bash
# Levantar solo frontends
docker compose up frontend-store frontend-admin

# Levantar todo el stack
docker compose up --build
```

### Variables de Entorno

#### Frontend Store
```env
# Opcional: URL base de la API
REACT_APP_API_BASE=http://localhost:5005

# Configuración de React
REACT_APP_VERSION=$npm_package_version
GENERATE_SOURCEMAP=false  # Para producción
```

#### Frontend Admin
```env
# Mismo formato que Frontend Store
REACT_APP_API_BASE=http://localhost:5005
```

---

## 🧪 Testing

### Configuración Actual
- **Framework**: Jest + React Testing Library
- **Cobertura**: Básica (solo tests de template)
- **Archivos de test**: `*.test.js`

### Comandos de Testing
```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --coverage

# Tests en modo CI
npm test -- --ci --coverage --collectCoverageFrom='src/**/*.{js,jsx}'
```

---

## 📱 Características Técnicas

### Compatibilidad de Navegadores
```json
{
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

### PWA Features
- [x] Manifest configurado
- [x] Service Worker básico (via React Scripts)
- [ ] Instalación offline
- [ ] Push notifications
- [ ] Background sync

### Performance
- [x] **Code Splitting**: Configurado via React Scripts
- [x] **Tree Shaking**: Automático en build
- [x] **Bundle Optimization**: webpack optimization
- [ ] **Lazy Loading**: A implementar para componentes
- [ ] **Image Optimization**: A implementar
- [ ] **Caching Strategy**: A implementar

---

## 🎨 Diseño y UX

### Estado Actual
- **Design System**: No implementado
- **Componentes**: Solo formulario básico en Store
- **Responsividad**: Básica (CSS flexbox)
- **Accesibilidad**: No auditada

### Recomendaciones de Mejora

#### UI/UX
1. **Design System**
   - Implementar biblioteca de componentes (Material-UI, Ant Design, Chakra UI)
   - Definir paleta de colores y tipografía
   - Crear componentes reutilizables

2. **Navegación**
   - Implementar React Router para SPA
   - Breadcrumbs para admin
   - Menú responsive

3. **Estados de Carga**
   - Skeleton screens
   - Progress indicators
   - Error boundaries

4. **Accesibilidad**
   - ARIA labels
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast compliance

---

## 📊 Resumen de Estado

### Frontend Store
| Funcionalidad | Estado | Progreso |
|---------------|--------|----------|
| Registro de usuarios | ✅ Completo | 100% |
| Autenticación | ❌ Pendiente | 0% |
| Catálogo de productos | ❌ Pendiente | 0% |
| Carrito de compras | ❌ Pendiente | 0% |
| Checkout | ❌ Pendiente | 0% |

### Frontend Admin
| Funcionalidad | Estado | Progreso |
|---------------|--------|----------|
| Estructura base | ✅ Completo | 100% |
| Autenticación | ❌ Pendiente | 0% |
| Dashboard | ❌ Pendiente | 0% |
| Gestión usuarios | ❌ Pendiente | 0% |
| Gestión productos | ❌ Pendiente | 0% |
| Reportes | ❌ Pendiente | 0% |

### Deuda Técnica
1. **Frontend Admin**: Requiere desarrollo completo
2. **Integración API**: Solo Store tiene integración parcial
3. **Testing**: Cobertura muy baja
4. **Documentación**: Falta documentación de componentes
5. **Performance**: Sin optimizaciones específicas
6. **Seguridad**: Sin validación robusta del lado cliente

### Próximos Pasos Recomendados
1. Implementar autenticación en ambos frontends
2. Desarrollar dashboard admin básico
3. Crear catálogo de productos en Store
4. Implementar sistema de navegación
5. Mejorar testing y cobertura
6. Implementar design system consistente