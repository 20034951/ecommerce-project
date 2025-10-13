# Frontend Store - Tienda Ecommerce

## Resumen

El Frontend Store es la aplicación React que proporciona la interfaz de la tienda online para los clientes finales. Construida con React 19, Vite 5, y TailwindCSS, ofrece una experiencia de compra moderna y responsive.

## Stack Tecnológico

### Dependencias Principales
```json
{
  "@hookform/resolvers": "^5.2.2",          // Resolvers para react-hook-form
  "@radix-ui/react-dialog": "^1.1.15",      // Componentes modales accesibles
  "@radix-ui/react-slot": "^1.2.3",         // Composition patterns
  "@tanstack/react-query": "^5.90.2",       // Estado del servidor
  "@tanstack/react-query-devtools": "^5.90.2", // DevTools para debugging
  "class-variance-authority": "^0.7.1",      // Variantes de clases CSS
  "clsx": "^2.1.1",                         // Utility para clases CSS
  "js-cookie": "^3.0.5",                    // Manejo de cookies
  "lucide-react": "^0.545.0",               // Librería de iconos
  "react": "^19.2.0",                       // Framework principal
  "react-dom": "^19.2.0",                   // DOM rendering
  "react-hook-form": "^7.65.0",             // Formularios performantes
  "react-router-dom": "^7.9.4",             // Routing SPA
  "tailgrids": "^2.3.0",                    // Grid components
  "tailwind-merge": "^3.3.1",               // Merge de clases Tailwind
  "zod": "^4.1.12"                          // Validación de esquemas
}
```

### Herramientas de Desarrollo
```json
{
  "@vitejs/plugin-react": "^5.0.4",         // Plugin React para Vite
  "autoprefixer": "^10.4.21",               // PostCSS autoprefixer
  "eslint": "^9.37.0",                      // Linting JavaScript
  "prettier": "^3.6.2",                     // Formateo de código
  "tailwindcss": "^4.1.14",                 // Framework CSS utility-first
  "vite": "^5.4.11",                        // Build tool moderno
  "vitest": "^3.2.4"                        // Testing framework rápido
}
```

## Arquitectura del Frontend

### Estructura de Directorios
```
frontend-store/src/
├── App.jsx               # Componente raíz
├── main.jsx             # Punto de entrada
├── index.css           # Estilos globales
├── api/                # Cliente API y servicios
│   ├── index.js        # Exportaciones centrales
│   ├── http.js         # Cliente HTTP configurado
│   ├── auth.js         # API autenticación
│   ├── categories.js   # API categorías
│   ├── customers.js    # API clientes
│   ├── products.js     # API productos
│   └── users.js        # API usuarios
├── auth/               # Sistema autenticación
│   ├── AuthProvider.jsx # Context provider
│   └── Guards.jsx      # Protección de rutas
├── components/         # Componentes reutilizables
│   ├── layout/         # Componentes de layout
│   │   ├── Header.jsx  # Header navegación
│   │   └── Footer.jsx  # Footer global
│   └── ui/             # Componentes UI básicos
│       ├── Alert.jsx   # Alertas/notificaciones
│       ├── Badge.jsx   # Etiquetas
│       ├── Button.jsx  # Botones
│       ├── Card.jsx    # Tarjetas contenedoras
│       ├── Dialog.jsx  # Modales
│       ├── Input.jsx   # Campos input
│       ├── Label.jsx   # Labels
│       ├── Skeleton.jsx # Loading skeletons
│       └── Spinner.jsx # Indicadores carga
├── contexts/           # React contexts
│   └── ThemeProvider.jsx # Proveedor de temas
├── layouts/            # Layouts principales
│   ├── MainLayout.jsx  # Layout tienda principal
│   └── AuthLayout.jsx  # Layout autenticación
├── modules/            # Módulos funcionales
│   ├── home/          # Página principal
│   ├── auth/          # Autenticación usuario
│   ├── catalog/       # Catálogo productos
│   ├── cart/          # Carrito compras
│   ├── checkout/      # Proceso checkout
│   ├── orders/        # Historial órdenes
│   ├── profile/       # Perfil usuario
│   ├── addresses/     # Direcciones envío
│   ├── wishlist/      # Lista deseos
│   ├── static/        # Páginas estáticas
│   └── errors/        # Páginas error
├── router/            # Configuración routing
│   └── index.jsx      # Router principal
└── utils/             # Utilidades
    └── cn.js          # Clase utility merger
```

## Módulos Principales

### 1. Home (`modules/home/`)
**Propósito**: Página principal y landing de la tienda.

**Funcionalidades**:
- Hero section promocional
- Productos destacados/más vendidos
- Categorías principales
- Ofertas y descuentos
- Newsletter signup
- Testimonios clientes

**Componentes**:
```jsx
// HomePage.jsx
- HeroSection: Banner principal con CTA
- FeaturedProducts: Productos destacados
- CategoryGrid: Grid de categorías
- PromoSection: Sección promocional
- Newsletter: Suscripción email
```

### 2. Catálogo (`modules/catalog/`)
**Propósito**: Navegación y exploración de productos.

**Páginas**:
- `CatalogPage.jsx`: Lista general de productos
- `CategoriesPage.jsx`: Lista de todas las categorías
- `CategoryProductsPage.jsx`: Productos de una categoría específica
- `ProductDetailPage.jsx`: Detalle completo del producto

**Funcionalidades**:
- Filtros avanzados (precio, categoría, marca)
- Ordenamiento (precio, popularidad, fecha)
- Búsqueda en tiempo real
- Paginación optimizada
- Vista grid/lista intercambiable
- Breadcrumbs de navegación

### 3. Carrito (`modules/cart/`)
**Propósito**: Gestión del carrito de compras.

**Funcionalidades**:
- Agregar/quitar productos
- Modificar cantidades
- Calcular totales y descuentos
- Aplicar cupones de descuento
- Estimación de envío
- Guardar carrito (usuarios registrados)
- Carrito persistente (localStorage)

**Hook principal**:
```jsx
// hooks/useCart.js
const useCart = () => {
  const [items, setItems] = useState([]);
  
  return {
    items,
    addItem: (product, quantity) => {},
    removeItem: (productId) => {},
    updateQuantity: (productId, quantity) => {},
    clearCart: () => {},
    getTotal: () => {},
    getItemCount: () => {}
  };
};
```

### 4. Checkout (`modules/checkout/`)
**Propósito**: Proceso completo de finalización de compra.

**Funcionalidades**:
- Información de envío
- Selección método pago
- Revisión orden final
- Confirmación compra
- Integración pasarelas pago (preparado)
- Cálculo impuestos y envío
- Validación formularios

**Flujo típico**:
1. Verificación carrito
2. Dirección de envío
3. Método de envío
4. Método de pago
5. Revisión final
6. Confirmación
7. Página de éxito

### 5. Autenticación (`modules/auth/`)
**Propósito**: Registro, login y gestión de cuenta.

**Páginas**:
- `LoginPage.jsx`: Iniciar sesión
- `RegisterPage.jsx`: Registro nuevo usuario
- `ForgotPasswordPage.jsx`: Recuperación contraseña
- `ResetPasswordPage.jsx`: Restablecer contraseña

**Funcionalidades**:
- Login con email/contraseña
- Registro con validación
- OAuth social (preparado)
- Reset de contraseña por email
- Remember me funcionalidad
- Auto-login con tokens

### 6. Perfil (`modules/profile/`)
**Propósito**: Gestión del perfil y configuración de usuario.

**Páginas**:
- `ProfilePage.jsx`: Información personal
- `SecurityPage.jsx`: Cambio contraseña y seguridad

**Funcionalidades**:
- Editar información personal
- Cambiar contraseña
- Gestionar direcciones
- Preferencias de notificación
- Historial de actividad
- Eliminar cuenta

### 7. Órdenes (`modules/orders/`)
**Propósito**: Historial y seguimiento de pedidos.

**Páginas**:
- `OrdersPage.jsx`: Lista de órdenes del usuario
- `OrderDetailPage.jsx`: Detalle específico de orden

**Funcionalidades**:
- Historial completo de órdenes
- Estado de envío en tiempo real
- Tracking de paquetes
- Reordenar productos
- Descargar facturas
- Solicitar devoluciones

### 8. Wishlist (`modules/wishlist/`)
**Propósito**: Lista de productos deseados.

**Funcionalidades**:
- Agregar/quitar productos de wishlist
- Compartir wishlist
- Mover a carrito
- Notificaciones precio/stock
- Wishlist pública/privada

### 9. Páginas Estáticas (`modules/static/`)
**Páginas informativas**:
- `AboutPage.jsx`: Sobre nosotros
- `ContactPage.jsx`: Contacto
- `HelpPage.jsx`: Centro de ayuda
- `PrivacyPage.jsx`: Política privacidad
- `TermsPage.jsx`: Términos y condiciones
- `ShippingPage.jsx`: Información envíos
- `ReturnsPage.jsx`: Política devoluciones

## Sistema de Autenticación

### AuthProvider (`auth/AuthProvider.jsx`)
```jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado global del usuario
  // Persistencia automática
  // Refresh de tokens
  
  const contextValue = {
    user,
    isAuthenticated: !!user,
    login: async (credentials) => {},
    register: async (userData) => {},
    logout: () => {},
    updateProfile: async (data) => {},
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Guards de Ruta (`auth/Guards.jsx`)
```jsx
// ProtectedRoute: Requiere autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  return children;
};

// GuestRoute: Solo para usuarios no autenticados
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

## Componentes de Layout

### MainLayout (`layouts/MainLayout.jsx`)
```jsx
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

### Header (`components/layout/Header.jsx`)
```jsx
const Header = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Store" className="h-8" />
          </Link>
          
          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <WishlistButton />
            <CartButton count={getItemCount()} />
            {user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Ingresar</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-4">
          <NavigationMenu />
        </nav>
      </div>
    </header>
  );
};
```

## Estado del Carrito

### useCart Hook (`modules/cart/hooks/useCart.js`)
```jsx
const useCart = () => {
  const [items, setItems] = useState(() => {
    // Cargar del localStorage al inicializar
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Persistir en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  }, []);
  
  const removeItem = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);
  
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);
  
  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
};
```

## Componentes UI Especializados

### ProductCard
```jsx
const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { addToWishlist } = useWishlist();
  
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2"
        >
          {product.discount}% OFF
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
          onClick={() => addToWishlist(product)}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <Card.Content className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">
              ${product.discountPrice}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={() => addItem(product)}
            className="shrink-0"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
```

### SearchBar
```jsx
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => api.products.search(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="pl-10 pr-4"
          />
        </div>
      </form>
      
      {isOpen && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">${product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Routing y Navegación

### Router Configuration (`router/index.jsx`)
```jsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Layouts
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';

// Guards
import { ProtectedRoute, GuestRoute } from '../auth/Guards.jsx';

// Lazy load pages
const HomePage = lazy(() => import('../modules/home/pages/HomePage.jsx'));
const CatalogPage = lazy(() => import('../modules/catalog/pages/CatalogPage.jsx'));
const ProductDetailPage = lazy(() => import('../modules/catalog/pages/ProductDetailPage.jsx'));
const CartPage = lazy(() => import('../modules/cart/pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('../modules/checkout/pages/CheckoutPage.jsx'));

// Auth pages
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../modules/auth/pages/RegisterPage.jsx'));

// Protected pages
const ProfilePage = lazy(() => import('../modules/profile/pages/ProfilePage.jsx'));
const OrdersPage = lazy(() => import('../modules/orders/pages/OrdersPage.jsx'));
const WishlistPage = lazy(() => import('../modules/wishlist/pages/WishlistPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        path: 'checkout',
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: 'orders',
        element: <ProtectedRoute><OrdersPage /></ProtectedRoute>
      },
      {
        path: 'wishlist',
        element: <ProtectedRoute><WishlistPage /></ProtectedRoute>
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <GuestRoute><LoginPage /></GuestRoute>
      },
      {
        path: 'register',
        element: <GuestRoute><RegisterPage /></GuestRoute>
      },
    ],
  },
]);
```

## Performance y SEO

### Optimizaciones Implementadas
1. **Lazy Loading**: Carga diferida de componentes y imágenes
2. **Code Splitting**: División automática del bundle
3. **Image Optimization**: Lazy loading y responsive images
4. **Service Worker**: Cache de recursos (preparado)
5. **Prefetching**: Carga anticipada de rutas críticas

### SEO Meta Tags
```jsx
// Cada página incluye meta tags específicos
const ProductDetailPage = ({ product }) => {
  useEffect(() => {
    document.title = `${product.name} - Tu Tienda`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', product.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', product.name);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', product.image);
  }, [product]);
  
  return <ProductDetail product={product} />;
};
```

### Web Vitals
- **Core Web Vitals** monitoreados
- **Performance budgets** configurados
- **Lighthouse CI** integrado (preparado)

## Responsive Design

### Breakpoints TailwindCSS
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    },
  },
};
```

### Mobile-First Approach
- Diseño responsive desde mobile
- Touch-friendly interactions
- Optimización para pantallas pequeñas
- Progressive Web App capabilities (preparado)

## Testing

### Estrategias de Testing
```javascript
// Ejemplo: ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../../contexts/CartContext';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  image: '/test-image.jpg',
};

test('should add product to cart when button clicked', () => {
  const { getByRole } = render(
    <CartProvider>
      <ProductCard product={mockProduct} />
    </CartProvider>
  );
  
  const addButton = getByRole('button', { name: /agregar/i });
  fireEvent.click(addButton);
  
  // Assert cart updated
});
```

## Variables de Entorno

### Configuración de Desarrollo
```bash
VITE_API_URL=http://localhost:5005/api
VITE_APP_NAME=Tu Tienda
VITE_NODE_ENV=development
VITE_PORT=3000
VITE_JWT_SECRET=your-jwt-secret
VITE_REFRESH_TOKEN_COOKIE_NAME=refreshToken
VITE_CACHE_TIME=300000
```

### Configuración de Producción
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Tu Tienda
VITE_NODE_ENV=production
VITE_GTM_ID=GTM-XXXXXXX
VITE_ANALYTICS_ID=GA-XXXXXXX
```

## Desarrollo y Deployment

### Scripts de Desarrollo
```bash
npm run dev           # Servidor desarrollo
npm run build         # Build producción
npm run preview       # Preview build
npm test             # Ejecutar tests
npm run lint         # Linting
npm run format       # Formateo
```

### Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', 'lucide-react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
```

### Progressive Web App
- **Manifest.json**: Configurado para instalación
- **Service Worker**: Cache strategies (preparado)
- **Offline Support**: Páginas básicas funcionan offline
- **Push Notifications**: Infraestructura preparada