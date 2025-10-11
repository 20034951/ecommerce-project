import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { PrivateRoute, PublicRoute } from '../auth/Guards.jsx';

// Lazy load components for better performance
const Home = lazy(() => import('../modules/home/pages/HomePage.jsx'));
const Catalog = lazy(() => import('../modules/catalog/pages/CatalogPage.jsx'));
const ProductDetail = lazy(() => import('../modules/catalog/pages/ProductDetailPage.jsx'));
const Categories = lazy(() => import('../modules/catalog/pages/CategoriesPage.jsx'));
const CategoryProducts = lazy(() => import('../modules/catalog/pages/CategoryProductsPage.jsx'));

// Auth pages
const Login = lazy(() => import('../modules/auth/pages/LoginPage.jsx'));
const Register = lazy(() => import('../modules/auth/pages/RegisterPage.jsx'));
const ForgotPassword = lazy(() => import('../modules/auth/pages/ForgotPasswordPage.jsx'));
const ResetPassword = lazy(() => import('../modules/auth/pages/ResetPasswordPage.jsx'));

// Cart & Checkout
const Cart = lazy(() => import('../modules/cart/pages/CartPage.jsx'));
const Checkout = lazy(() => import('../modules/checkout/pages/CheckoutPage.jsx'));

// User Profile
const Profile = lazy(() => import('../modules/profile/pages/ProfilePage.jsx'));
const Orders = lazy(() => import('../modules/orders/pages/OrdersPage.jsx'));
const OrderDetail = lazy(() => import('../modules/orders/pages/OrderDetailPage.jsx'));
const Addresses = lazy(() => import('../modules/addresses/pages/AddressesPage.jsx'));
const Wishlist = lazy(() => import('../modules/wishlist/pages/WishlistPage.jsx'));

// Static pages
const About = lazy(() => import('../modules/static/pages/AboutPage.jsx'));
const Contact = lazy(() => import('../modules/static/pages/ContactPage.jsx'));
const Help = lazy(() => import('../modules/static/pages/HelpPage.jsx'));
const Shipping = lazy(() => import('../modules/static/pages/ShippingPage.jsx'));
const Returns = lazy(() => import('../modules/static/pages/ReturnsPage.jsx'));
const Privacy = lazy(() => import('../modules/static/pages/PrivacyPage.jsx'));
const Terms = lazy(() => import('../modules/static/pages/TermsPage.jsx'));

// Error pages
const NotFound = lazy(() => import('../modules/errors/pages/NotFoundPage.jsx'));
const Unauthorized = lazy(() => import('../modules/errors/pages/UnauthorizedPage.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // Catalog routes
      {
        path: 'catalog',
        element: <Catalog />
      },
      {
        path: 'product/:id',
        element: <ProductDetail />
      },
      {
        path: 'categories',
        element: <Categories />
      },
      {
        path: 'category/:slug',
        element: <CategoryProducts />
      },
      // Cart routes
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        )
      },
      // User routes (protected)
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        )
      },
      {
        path: 'orders/:id',
        element: (
          <PrivateRoute>
            <OrderDetail />
          </PrivateRoute>
        )
      },
      {
        path: 'addresses',
        element: (
          <PrivateRoute>
            <Addresses />
          </PrivateRoute>
        )
      },
      {
        path: 'wishlist',
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        )
      },
      // Static pages
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'help',
        element: <Help />
      },
      {
        path: 'shipping',
        element: <Shipping />
      },
      {
        path: 'returns',
        element: <Returns />
      },
      {
        path: 'privacy',
        element: <Privacy />
      },
      {
        path: 'terms',
        element: <Terms />
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
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        )
      },
      {
        path: 'reset-password',
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        )
      }
    ]
  },
  // Catch all route
  {
    path: '*',
    element: <NotFound />
  }
]);