# Testing - Estrategias y Guías

## Resumen

El proyecto implementa una estrategia de testing comprehensiva que incluye tests unitarios, de integración y end-to-end. Utilizamos Jest para el backend y Vitest para los frontends.

## Estructura de Testing

### Backend Testing
```
backend/tests/
├── setup.js              # Configuración global tests
├── user.test.js           # Tests modelo User
├── category.test.js       # Tests modelo Category
├── product.test.js        # Tests modelo Product
├── role.test.js           # Tests modelo Role
└── passwordReset.test.js  # Tests reset contraseña
```

### Frontend Testing
```
frontend-admin/src/
├── setupTests.js          # Configuración global
└── **/__tests__/         # Tests co-localizados
    ├── components/
    ├── hooks/
    └── pages/

frontend-store/src/
├── setupTests.js          # Configuración global  
└── **/__tests__/         # Tests co-localizados
```

## Configuración de Testing

### Backend - Jest Configuration
```javascript
// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/setup.js'
  ],
  testTimeout: 30000,
  verbose: true
};
```

### Frontend - Vitest Configuration  
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    css: true,
  },
});
```

### Setup Global de Tests

#### Backend Setup (tests/setup.js)
```javascript
import db from '../src/models/index.js';

// Configuración base de datos de testing
beforeAll(async () => {
  // Sincronizar base de datos
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cerrar conexiones
  await db.sequelize.close();
});

beforeEach(async () => {
  // Limpiar datos entre tests
  await db.User.destroy({ where: {}, truncate: true, cascade: true });
  await db.Category.destroy({ where: {}, truncate: true, cascade: true });
  await db.Product.destroy({ where: {}, truncate: true, cascade: true });
});

// Mock servicios externos
jest.mock('../src/services/emailService.js', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
}));
```

#### Frontend Setup (setupTests.js)
```javascript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Tests Backend

### Tests de Modelos
```javascript
// tests/user.test.js
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('User Model', () => {
  describe('POST /api/auth/register', () => {
    test('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      
      // Verificar en base de datos
      const user = await db.User.findOne({ 
        where: { email: userData.email } 
      });
      expect(user).toBeTruthy();
    });

    test('should not create user with duplicate email', async () => {
      // Crear usuario inicial
      await db.User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password_hash: 'hashedpassword'
      });

      const userData = {
        name: 'Duplicate User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
```

### Tests de Rutas
```javascript
// tests/category.test.js
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';
import { generateToken } from '../src/services/authService.js';

describe('Category Routes', () => {
  let authToken;
  let adminUser;

  beforeEach(async () => {
    // Crear usuario admin para tests
    adminUser = await db.User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: 'hashedpassword',
      role: 'admin'
    });

    authToken = generateToken(adminUser);
  });

  describe('GET /api/categories', () => {
    test('should return all categories', async () => {
      // Crear categorías de prueba
      await db.Category.bulkCreate([
        { name: 'Electronics', description: 'Electronic items' },
        { name: 'Books', description: 'Books and literature' }
      ]);

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('POST /api/categories', () => {
    test('should create new category', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'A new category'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData)
        .expect(201);

      expect(response.body.name).toBe(categoryData.name);
      
      // Verificar en base de datos
      const category = await db.Category.findOne({
        where: { name: categoryData.name }
      });
      expect(category).toBeTruthy();
    });

    test('should require authentication', async () => {
      const categoryData = {
        name: 'Unauthorized Category',
        description: 'This should fail'
      };

      await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(401);
    });
  });
});
```

### Tests de Servicios
```javascript
// tests/authService.test.js
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken 
} from '../src/services/authService.js';
import db from '../src/models/index.js';

describe('Auth Service', () => {
  describe('Password hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt pattern
    });

    test('should compare password correctly', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);
      
      const isInvalid = await comparePassword('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT tokens', () => {
    test('should generate and verify token', () => {
      const user = {
        user_id: 1,
        email: 'test@example.com',
        role: 'customer'
      };

      const token = generateToken(user);
      expect(token).toBeTruthy();
      
      const decoded = verifyToken(token);
      expect(decoded.user_id).toBe(user.user_id);
      expect(decoded.email).toBe(user.email);
    });

    test('should reject invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });
  });
});
```

## Tests Frontend

### Tests de Componentes
```javascript
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  test('disables button when loading', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });
});
```

### Tests de Hooks
```javascript
// src/hooks/__tests__/useCart.test.js
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';

describe('useCart Hook', () => {
  test('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getTotal()).toBe(0);
  });

  test('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99
    };

    act(() => {
      result.current.addItem(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.getTotal()).toBe(59.98);
  });

  test('should update quantity for existing item', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: 1,
      name: 'Test Product',
      price: 29.99
    };

    act(() => {
      result.current.addItem(product, 1);
      result.current.addItem(product, 2); // should update quantity
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });
});
```

### Tests de Pages
```javascript
// src/pages/__tests__/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '../LoginPage';

// Mock del hook de autenticación
const mockLogin = vi.fn();
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null
  })
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    mockLogin.mockResolvedValueOnce({ user: { id: 1 } });
    
    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('displays validation errors', async () => {
    renderWithProviders(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
    });
  });
});
```

## Tests de Integración

### API Integration Tests
```javascript
// tests/integration/auth.integration.test.js
import request from 'supertest';
import app from '../../src/app.js';
import db from '../../src/models/index.js';

describe('Authentication Integration', () => {
  test('complete auth flow: register -> login -> protected route', async () => {
    // 1. Register new user
    const userData = {
      name: 'Integration Test User',
      email: 'integration@test.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(registerResponse.body.user.email).toBe(userData.email);

    // 2. Login with created user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })
      .expect(200);

    const { token } = loginResponse.body;
    expect(token).toBeTruthy();

    // 3. Access protected route
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.email).toBe(userData.email);

    // 4. Try accessing without token (should fail)
    await request(app)
      .get('/api/users/profile')
      .expect(401);
  });
});
```

### E2E Tests (Preparado para Playwright)
```javascript
// e2e/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('user can login successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciales inválidas');
  });
});
```

## Coverage y Reportes

### Configuración Coverage
```javascript
// jest.config.cjs - Backend
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',           // Entry point
    '!src/seedDatabase.js',   // Seed script
    '!src/**/*.test.js'      // Test files
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Comandos de Testing
```bash
# Backend
npm test                    # Ejecutar todos los tests
npm run test:watch         # Watch mode
npm run test:coverage      # Con coverage
npm run test:unit          # Solo tests unitarios
npm run test:integration   # Solo tests integración

# Frontend
npm test                   # Ejecutar tests
npm run test:ui           # UI de testing
npm run test:coverage     # Con coverage
npm run test:watch        # Watch mode
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpassword
          MYSQL_DATABASE: ecommerce_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 3306
          DB_USER: root
          DB_PASS: testpassword
          DB_NAME: ecommerce_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Mocking Strategies

### Mock Servicios Externos
```javascript
// Mock email service
jest.mock('../src/services/emailService.js', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockImplementation((user, token) => {
    console.log(`Mock email sent to ${user.email} with token ${token}`);
    return Promise.resolve(true);
  })
}));

// Mock Redis
jest.mock('../src/utils/redisClient.js', () => ({
  getCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(true),
  deleteCache: jest.fn().mockResolvedValue(true),
  clearCache: jest.fn().mockResolvedValue(true)
}));
```

### Mock HTTP Requests (Frontend)
```javascript
// Mock fetch API
global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/api/auth/login')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        user: { id: 1, email: 'test@example.com' },
        token: 'fake-jwt-token'
      })
    });
  }
  
  return Promise.resolve({
    ok: false,
    status: 404
  });
});
```

## Test Data Management

### Factories para Test Data
```javascript
// tests/factories/userFactory.js
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../src/services/authService.js';

export const createUser = async (overrides = {}) => {
  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password_hash: await hashPassword('password123'),
    phone: faker.phone.number(),
    role: 'customer',
    isActive: true,
    ...overrides
  };
  
  return userData;
};

export const createAdmin = async () => {
  return createUser({ role: 'admin' });
};
```

### Fixtures para Tests
```javascript
// tests/fixtures/products.js
export const productFixtures = [
  {
    name: 'Test Product 1',
    description: 'A test product',
    price: 29.99,
    stock_quantity: 100,
    sku: 'TEST-001',
    isActive: true
  },
  {
    name: 'Test Product 2',
    description: 'Another test product',
    price: 49.99,
    stock_quantity: 50,
    sku: 'TEST-002',
    isActive: true
  }
];
```

## Performance Testing

### Load Testing con Artillery
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5005'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: 'Get products'
    flow:
      - get:
          url: '/api/products'
      - think: 1
      
  - name: 'Login and get profile'
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            json: '$.token'
            as: 'token'
      - get:
          url: '/api/users/profile'
          headers:
            Authorization: 'Bearer {{ token }}'
```

### Comandos Performance
```bash
# Instalar Artillery
npm install -g artillery

# Ejecutar load test
artillery run artillery-config.yml

# Quick test
artillery quick --duration 30 --rate 10 http://localhost:5005/api/products
```

## Best Practices

### Test Organization
1. **Co-location**: Tests cerca del código que prueban
2. **Descriptive names**: Nombres claros de lo que prueban
3. **AAA Pattern**: Arrange, Act, Assert
4. **Single responsibility**: Un test, una funcionalidad
5. **Independent tests**: No dependencias entre tests

### Test Data
1. **Fresh data**: Datos limpios para cada test
2. **Realistic data**: Usar Faker para datos realistas
3. **Edge cases**: Probar casos límite
4. **Error scenarios**: Probar manejo de errores

### Maintenance
1. **Regular updates**: Actualizar tests con cambios de código
2. **Flaky tests**: Identificar y arreglar tests inestables
3. **Test coverage**: Mantener coverage mínimo (70%+)
4. **CI integration**: Tests en cada commit/PR