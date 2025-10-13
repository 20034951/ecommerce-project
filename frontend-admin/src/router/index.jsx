import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { AdminRoute, PublicAdminRoute, PasswordResetRoute } from '../auth/Guards.jsx';
import AdminErrorElement from '../components/router/AdminErrorElement.jsx';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../modules/dashboard/pages/DashboardPage.jsx'));

// Helper functions to create route elements
const createAdminRoute = (Component) => (
  <AdminRoute>
    <Component />
  </AdminRoute>
);

const createPublicAdminRoute = (Component) => (
  <PublicAdminRoute>
    <Component />
  </PublicAdminRoute>
);

// Auth pages
const Login = lazy(() => import('../modules/auth/pages/LoginPage.jsx'));
const ForgotPassword = lazy(() => import('../modules/auth/pages/ForgotPasswordPage.jsx'));
const ResetPassword = lazy(() => import('../modules/auth/pages/ResetPasswordPage.jsx'));

// Admin modules
const Users = lazy(() => import('../modules/users/pages/UsersPage.jsx'));
const UserDetail = lazy(() => import('../modules/users/pages/UserDetailPage.jsx'));
const CreateUser = lazy(() => import('../modules/users/pages/CreateUserPage.jsx'));
const EditUser = lazy(() => import('../modules/users/pages/EditUserPage.jsx'));
const UserSessions = lazy(() => import('../modules/users/pages/UserSessionsPage.jsx'));

const Products = lazy(() => import('../modules/products/pages/ProductsPage.jsx'));
const ProductDetail = lazy(() => import('../modules/products/pages/ProductDetailPage.jsx'));
const CreateProduct = lazy(() => import('../modules/products/pages/CreateProductPage.jsx'));

const Categories = lazy(() => import('../modules/categories/pages/CategoriesPage.jsx'));
const CategoryDetail = lazy(() => import('../modules/categories/pages/CategoryDetailPage.jsx'));
const CreateCategory = lazy(() => import('../modules/categories/pages/CreateCategoryPage.jsx'));

const Orders = lazy(() => import('../modules/orders/pages/OrdersPage.jsx'));
const OrderDetail = lazy(() => import('../modules/orders/pages/OrderDetailPage.jsx'));

const Roles = lazy(() => import('../modules/roles/pages/RolesPage.jsx'));
const RoleDetail = lazy(() => import('../modules/roles/pages/RoleDetailPage.jsx'));
const CreateRole = lazy(() => import('../modules/roles/pages/CreateRolePage.jsx'));

const Settings = lazy(() => import('../modules/settings/pages/SettingsPage.jsx'));

// Error pages
const NotFound = lazy(() => import('../modules/errors/pages/NotFoundPage.jsx'));
const AdminNotFound = lazy(() => import('../modules/errors/pages/AdminNotFoundPage.jsx'));
const AdminError = lazy(() => import('../modules/errors/pages/AdminErrorPage.jsx'));
const Unauthorized = lazy(() => import('../modules/errors/pages/UnauthorizedPage.jsx'));
const ErrorTest = lazy(() => import('../modules/errors/pages/ErrorTestPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <AdminErrorElement />,
    children: [
      {
        index: true,
        element: createAdminRoute(Dashboard)
      },
      {
        path: 'dashboard',
        element: createAdminRoute(Dashboard)
      },
      // Users management
      {
        path: 'users',
        element: createAdminRoute(Users)
      },
      {
        path: 'users/create',
        element: createAdminRoute(CreateUser)
      },
      {
        path: 'users/:id',
        element: createAdminRoute(UserDetail)
      },
      {
        path: 'users/:id/edit',
        element: createAdminRoute(EditUser)
      },
      {
        path: 'users/:id/sessions',
        element: createAdminRoute(UserSessions)
      },
      // Products management
      {
        path: 'products',
        element: (
          <AdminRoute>
            <Products />
          </AdminRoute>
        )
      },
      {
        path: 'products/create',
        element: (
          <AdminRoute>
            <CreateProduct />
          </AdminRoute>
        )
      },
      {
        path: 'products/:id',
        element: (
          <AdminRoute>
            <ProductDetail />
          </AdminRoute>
        )
      },
      // Categories management
      {
        path: 'categories',
        element: (
          <AdminRoute>
            <Categories />
          </AdminRoute>
        )
      },
      {
        path: 'categories/create',
        element: (
          <AdminRoute>
            <CreateCategory />
          </AdminRoute>
        )
      },
      {
        path: 'categories/:id',
        element: (
          <AdminRoute>
            <CategoryDetail />
          </AdminRoute>
        )
      },
      // Orders management
      {
        path: 'orders',
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        )
      },
      {
        path: 'orders/:id',
        element: (
          <AdminRoute>
            <OrderDetail />
          </AdminRoute>
        )
      },
      // Roles management
      {
        path: 'roles',
        element: (
          <AdminRoute>
            <Roles />
          </AdminRoute>
        )
      },
      {
        path: 'roles/create',
        element: (
          <AdminRoute>
            <CreateRole />
          </AdminRoute>
        )
      },
      {
        path: 'roles/:id/edit',
        element: (
          <AdminRoute>
            <CreateRole />
          </AdminRoute>
        )
      },
      {
        path: 'roles/:id',
        element: (
          <AdminRoute>
            <RoleDetail />
          </AdminRoute>
        )
      },
      // Settings
      {
        path: 'settings',
        element: (
          <AdminRoute>
            <Settings />
          </AdminRoute>
        )
      },
      // Error testing (solo en desarrollo)
      ...(process.env.NODE_ENV === 'development' ? [{
        path: 'error-test',
        element: (
          <AdminRoute>
            <ErrorTest />
          </AdminRoute>
        )
      }] : []),
      // Error pages
      {
        path: 'unauthorized',
        element: <Unauthorized />
      },
      // Catch all route for admin area
      {
        path: '*',
        element: (
          <AdminRoute>
            <AdminNotFound />
          </AdminRoute>
        )
      }
    ]
  },
  // Auth routes (public only)
  {
    path: '/admin',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicAdminRoute>
            <Login />
          </PublicAdminRoute>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PasswordResetRoute>
            <ForgotPassword />
          </PasswordResetRoute>
        )
      },
      {
        path: 'reset-password',
        element: (
          <PasswordResetRoute>
            <ResetPassword />
          </PasswordResetRoute>
        )
      }
    ]
  },
  // Redirect root to admin dashboard
  {
    path: '/',
    element: (
      <AdminRoute redirectTo="/admin/login">
        <Dashboard />
      </AdminRoute>
    )
  },
  // Catch all route
  {
    path: '*',
    element: <NotFound />
  }
]);