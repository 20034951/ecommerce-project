import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { AdminRoute, PublicAdminRoute } from '../auth/Guards.jsx';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../modules/dashboard/pages/DashboardPage.jsx'));

// Auth pages
const Login = lazy(() => import('../modules/auth/pages/LoginPage.jsx'));
const ForgotPassword = lazy(() => import('../modules/auth/pages/ForgotPasswordPage.jsx'));
const ResetPassword = lazy(() => import('../modules/auth/pages/ResetPasswordPage.jsx'));

// Admin modules
const Users = lazy(() => import('../modules/users/pages/UsersPage.jsx'));
const UserDetail = lazy(() => import('../modules/users/pages/UserDetailPage.jsx'));
const CreateUser = lazy(() => import('../modules/users/pages/CreateUserPage.jsx'));

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
const Unauthorized = lazy(() => import('../modules/errors/pages/UnauthorizedPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        )
      },
      // Users management
      {
        path: 'users',
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        )
      },
      {
        path: 'users/create',
        element: (
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        )
      },
      {
        path: 'users/:id',
        element: (
          <AdminRoute>
            <UserDetail />
          </AdminRoute>
        )
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
      // Error pages
      {
        path: 'unauthorized',
        element: <Unauthorized />
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
          <PublicAdminRoute>
            <ForgotPassword />
          </PublicAdminRoute>
        )
      },
      {
        path: 'reset-password',
        element: (
          <PublicAdminRoute>
            <ResetPassword />
          </PublicAdminRoute>
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