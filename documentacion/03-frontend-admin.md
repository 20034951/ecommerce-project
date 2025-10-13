# Frontend Admin - Panel Administrativo

## Resumen

El Frontend Admin es una aplicación React moderna que proporciona una interfaz completa para la administración del ecommerce. Construida con React 19, Vite 5, y TailwindCSS, ofrece una experiencia de usuario fluida y profesional.

## Stack Tecnológico

### Dependencias Principales
```json
{
  "@radix-ui/react-dialog": "^1.1.15",     // Componentes UI accesibles
  "@radix-ui/react-slot": "^1.2.3",        // Composition patterns
  "@tanstack/react-query": "^5.90.2",      // Estado del servidor
  "@tanstack/react-query-devtools": "^5.90.2", // DevTools para TanStack Query
  "class-variance-authority": "^0.7.1",     // Variantes de clases CSS
  "clsx": "^2.1.1",                        // Utility para clases CSS
  "js-cookie": "^3.0.5",                   // Manejo de cookies
  "lucide-react": "^0.545.0",              // Iconos
  "react": "^19.2.0",                      // Framework principal
  "react-dom": "^19.2.0",                  // DOM rendering
  "react-hook-form": "^7.65.0",            // Manejo de formularios
  "react-router-dom": "^7.9.4",            // Routing SPA
  "recharts": "^3.2.1",                    // Gráficos y charts
  "tailwind-merge": "^3.3.1",              // Merge de clases Tailwind
  "zod": "^4.1.12"                         // Validación de schemas
}
```

### Dependencias de Desarrollo
```json
{
  "@vitejs/plugin-react": "^5.0.4",        // Plugin React para Vite
  "autoprefixer": "^10.4.21",              // PostCSS autoprefixer
  "eslint": "^9.37.0",                     // Linting JavaScript
  "prettier": "^3.6.2",                    // Formateo de código
  "tailwindcss": "^4.1.14",                // Framework CSS
  "vite": "^5.4.11",                       // Build tool
  "vitest": "^3.2.4"                       // Testing framework
}
```

## Arquitectura del Frontend

### Estructura de Directorios
```
frontend-admin/src/
├── App.jsx                # Componente principal
├── index.jsx             # Punto de entrada
├── App.css               # Estilos globales
├── api/                  # Cliente API
│   ├── index.js          # Configuración base
│   ├── http.js           # Cliente HTTP
│   ├── auth.js           # Endpoints autenticación
│   ├── users.js          # Endpoints usuarios
│   ├── products.js       # Endpoints productos
│   ├── categories.js     # Endpoints categorías
│   └── roles.js          # Endpoints roles
├── auth/                 # Sistema de autenticación
│   ├── AuthProvider.jsx  # Context de auth
│   └── Guards.jsx        # Rutas protegidas
├── components/           # Componentes reutilizables
│   ├── debug/           # Herramientas debug
│   ├── layout/          # Componentes layout
│   ├── router/          # Componentes router
│   ├── theme/           # Control de tema
│   └── ui/              # UI components
├── contexts/            # React contexts
│   ├── SidebarContext.jsx
│   └── ThemeContext.jsx
├── hooks/               # Custom hooks
│   ├── useConfirmation.js
│   ├── useTokenManager.js
│   └── useSimpleTokenManager.js
├── layouts/             # Layouts principales
│   ├── AdminLayout.jsx  # Layout admin
│   └── AuthLayout.jsx   # Layout autenticación
├── modules/             # Módulos funcionales
│   ├── auth/           # Autenticación
│   ├── dashboard/      # Dashboard principal
│   ├── users/          # Gestión usuarios
│   ├── products/       # Gestión productos
│   ├── categories/     # Gestión categorías
│   ├── orders/         # Gestión órdenes
│   ├── roles/          # Gestión roles
│   ├── settings/       # Configuración
│   └── errors/         # Páginas de error
├── router/             # Configuración routing
│   └── index.jsx       # Router principal
├── store/              # Estado global (preparado)
└── utils/              # Utilidades
    ├── cn.js           # Utility clases CSS
    └── tokenUtils.js   # Utils para tokens
```

## Módulos Principales

### 1. Dashboard (`modules/dashboard/`)
**Propósito**: Panel principal con métricas y resumen del sistema.

**Funcionalidades**:
- Métricas generales (usuarios, productos, órdenes)
- Gráficos de ventas con Recharts
- Accesos rápidos a funciones principales
- Estado del sistema en tiempo real

**Componentes principales**:
```jsx
// DashboardPage.jsx
- Métricas cards
- Charts de ventas
- Tabla de órdenes recientes
- Quick actions

// hooks/useDashboardData.js
- Consulta métricas API
- Refresh automático datos
```

### 2. Usuarios (`modules/users/`)
**Propósito**: Gestión completa de usuarios del sistema.

**Páginas**:
- `UsersPage.jsx`: Lista de usuarios con filtros y paginación
- `UserDetailPage.jsx`: Ver detalles de usuario específico
- `CreateUserPage.jsx`: Crear nuevo usuario
- `EditUserPage.jsx`: Editar usuario existente
- `UserSessionsPage.jsx`: Ver sesiones activas

**Funcionalidades**:
- CRUD completo de usuarios
- Filtros avanzados (rol, estado, fecha)
- Gestión de roles y permisos
- Vista de sesiones activas
- Activación/desactivación masiva

### 3. Productos (`modules/products/`)
**Propósito**: Administración del catálogo de productos.

**Páginas**:
- `ProductsPage.jsx`: Lista de productos con filtros
- `ProductDetailPage.jsx`: Detalles del producto
- `CreateProductPage.jsx`: Crear nuevo producto

**Funcionalidades**:
- CRUD de productos
- Gestión de categorías
- Subida de imágenes (preparado)
- Control de inventario
- Precios y descuentos
- SEO metadata

### 4. Categorías (`modules/categories/`)
**Propósito**: Organización jerárquica del catálogo.

**Páginas**:
- `CategoriesPage.jsx`: Lista jerárquica de categorías
- `CategoryDetailPage.jsx`: Detalles de categoría
- `CreateCategoryPage.jsx`: Crear nueva categoría

**Funcionalidades**:
- Estructura jerárquica (padre/hijo)
- Drag & drop reordenamiento (preparado)
- Asociación con productos
- Gestión de meta tags

### 5. Órdenes (`modules/orders/`)
**Propósito**: Administración de órdenes y ventas.

**Páginas**:
- `OrdersPage.jsx`: Lista de órdenes con filtros
- `OrderDetailPage.jsx`: Detalles completos de orden

**Funcionalidades**:
- Estados de órdenes (pending, processing, shipped, delivered)
- Filtros por fecha, estado, cliente
- Tracking de envíos (preparado)
- Reportes de ventas
- Gestión de devoluciones (preparado)

### 6. Roles (`modules/roles/`)
**Propósito**: Sistema de permisos y roles de usuario.

**Páginas**:
- `RolesPage.jsx`: Lista de roles del sistema
- `RoleDetailPage.jsx`: Detalles y permisos de rol
- `CreateRolePage.jsx`: Crear nuevo rol

**Funcionalidades**:
- Definición de permisos granulares
- Asignación de roles a usuarios
- Jerarquía de roles
- Auditoría de permisos

## Sistema de Autenticación

### AuthProvider (`auth/AuthProvider.jsx`)
```jsx
// Context global de autenticación
// Estado persistente con localStorage
// Refresh automático de tokens
// Logout automático en expiración

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Funciones disponibles:
  // - login(credentials)
  // - logout()  
  // - refreshToken()
  // - updateUser(userData)
  // - checkAuthStatus()
};
```

### Guards de Ruta (`auth/Guards.jsx`)
```jsx
// AdminRoute: Protege rutas que requieren autenticación
// PublicAdminRoute: Rutas solo para usuarios no autenticados
// PasswordResetRoute: Rutas específicas para reset

// Uso:
<AdminRoute>
  <ProtectedComponent />
</AdminRoute>
```

### Token Management
```javascript
// useTokenManager.js
// Manejo automático de tokens JWT
// Refresh automático antes de expiración
// Storage seguro en httpOnly cookies

const {
  isAuthenticated,
  user,
  login,
  logout,
  refreshToken
} = useTokenManager();
```

## Componentes UI Reutilizables

### Sistema de Componentes (`components/ui/`)
```jsx
// Button.jsx - Botones con variantes
<Button variant="primary" size="lg">Guardar</Button>
<Button variant="outline" size="sm">Cancelar</Button>

// Input.jsx - Inputs con validación
<Input 
  label="Email" 
  type="email" 
  error="Campo requerido"
  placeholder="usuario@ejemplo.com" 
/>

// Card.jsx - Contenedores de contenido
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Content>Contenido</Card.Content>
</Card>

// Dialog.jsx - Modales accesibles
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Trigger asChild>
    <Button>Abrir Modal</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Título Modal</Dialog.Title>
    </Dialog.Header>
    Contenido del modal
  </Dialog.Content>
</Dialog>

// Alert.jsx - Alertas y notificaciones
<Alert variant="success">
  <Alert.Title>Éxito</Alert.Title>
  <Alert.Description>Operación completada</Alert.Description>
</Alert>

// Spinner.jsx - Indicadores de carga
<Spinner size="lg" className="text-blue-600" />

// Badge.jsx - Etiquetas y estados
<Badge variant="success">Activo</Badge>
<Badge variant="destructive">Inactivo</Badge>
```

## Layout System

### AdminLayout (`layouts/AdminLayout.jsx`)
```jsx
// Layout principal del panel administrativo
// Incluye:
// - Header con navegación
// - Sidebar colapsible
// - Área de contenido principal
// - Breadcrumbs automáticos
// - Theme toggle

const AdminLayout = () => (
  <div className="min-h-screen bg-background">
    <AdminHeader />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);
```

### AuthLayout (`layouts/AuthLayout.jsx`)
```jsx
// Layout para páginas de autenticación
// Centrado y responsive
// Branding y diseño limpio

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <Outlet />
    </div>
  </div>
);
```

## Sistema de Tema

### ThemeProvider (`contexts/ThemeContext.jsx`)
```jsx
// Soporte para tema claro/oscuro
// Persistencia en localStorage
// Detección de preferencia del sistema

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  
  // Temas disponibles: 'light', 'dark', 'system'
  // Aplicación automática de clases CSS
};
```

### ThemeController (`components/theme/ThemeController.jsx`)
```jsx
// Controlador automático del tema
// Sincronización con preferencias del usuario
// Aplicación de clases CSS a <html>

useEffect(() => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}, [theme]);
```

## Estado del Servidor (TanStack Query)

### Configuración Global
```javascript
// App.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});
```

### Hooks de Datos
```javascript
// Ejemplo: hooks/useUsers.js
export const useUsers = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => api.users.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
```

## API Client

### Configuración HTTP (`api/http.js`)
```javascript
// Cliente Axios configurado
// Interceptores para tokens
// Manejo de errores centralizado
// Base URL y headers automáticos

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5005/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para tokens
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout automático
      auth.logout();
    }
    return Promise.reject(error);
  }
);
```

### Servicios API (`api/`)
```javascript
// users.js
export const usersAPI = {
  getAll: (filters) => api.get('/users', { params: filters }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// products.js
export const productsAPI = {
  getAll: (filters) => api.get('/products', { params: filters }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
};
```

## Routing y Navegación

### Router Configuration (`router/index.jsx`)
```jsx
// Lazy loading para performance
// Rutas protegidas con Guards
// Layouts anidados
// Error boundaries

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <AdminErrorElement />,
    children: [
      {
        index: true,
        element: createAdminRoute(Dashboard),
      },
      {
        path: 'users',
        children: [
          { index: true, element: createAdminRoute(Users) },
          { path: 'new', element: createAdminRoute(CreateUser) },
          { path: ':id', element: createAdminRoute(UserDetail) },
        ],
      },
      // ... más rutas
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: createPublicAdminRoute(Login) },
      { path: 'forgot-password', element: createPublicAdminRoute(ForgotPassword) },
    ],
  },
]);
```

## Formularios y Validación

### React Hook Form + Zod
```jsx
// Ejemplo: CreateUserForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'customer'], 'Rol requerido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
});

const CreateUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const createUser = useCreateUser();

  const onSubmit = async (data) => {
    try {
      await createUser.mutateAsync(data);
      // Éxito
    } catch (error) {
      // Error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        {...register('name')}
        label="Nombre"
        error={errors.name?.message}
      />
      <Input 
        {...register('email')}
        type="email"
        label="Email"
        error={errors.email?.message}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creando...' : 'Crear Usuario'}
      </Button>
    </form>
  );
};
```

## Performance y Optimización

### Estrategias Implementadas
1. **Lazy Loading**: Componentes cargados bajo demanda
2. **Code Splitting**: Separación automática por rutas
3. **React Query**: Cache inteligente del servidor
4. **Memoization**: React.memo en componentes costosos
5. **Bundle Optimization**: Vite optimizaciones automáticas

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

### Optimizaciones Vite
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', 'lucide-react'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

## Testing

### Configuración de Testing
```javascript
// vitest.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
  },
});
```

### Estrategias de Testing
1. **Unit Tests**: Componentes aislados
2. **Integration Tests**: Flujos completos
3. **E2E Tests**: User journeys críticos
4. **Visual Regression**: Snapshots de componentes

### Comandos de Testing
```bash
npm test          # Ejecutar tests
npm run test:ui   # UI para tests
npm run test:coverage # Coverage report
```

## Desarrollo

### Scripts Disponibles
```bash
npm run dev           # Servidor desarrollo
npm run build         # Build producción  
npm run preview       # Preview build local
npm run lint          # Linting código
npm run lint:fix      # Fix automático lint
npm run format        # Formateo Prettier
npm run format:check  # Check formato
```

### Variables de Entorno
```bash
VITE_API_URL=http://localhost:5005/api
VITE_APP_NAME=Admin Panel
VITE_NODE_ENV=development
VITE_PORT=3001
VITE_JWT_SECRET=your-jwt-secret
VITE_REFRESH_TOKEN_COOKIE_NAME=refreshToken
VITE_CACHE_TIME=300000
```

### Hot Reload y DevTools
- **Vite HMR**: Hot Module Replacement instantáneo
- **React DevTools**: Debugging componentes
- **TanStack Query DevTools**: Debug queries
- **Redux DevTools**: Estado global (cuando se implemente)

## Deployment

### Build Optimization
```bash
# Análisis del bundle
npm run build
npm run preview

# Análisis de tamaño
npx vite-bundle-analyzer dist
```

### Variables de Producción
```bash
VITE_API_URL=https://api.yourstore.com/api
VITE_APP_NAME=Store Admin
VITE_NODE_ENV=production
```

### Docker Build
```dockerfile
# Multi-stage build optimizado
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```