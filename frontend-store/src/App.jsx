import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { router } from './router/index.jsx';
import { Spinner } from './components/ui';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './modules/cart/context/CartContext.jsx';



// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Global loading component
function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" className="text-primary-600" />
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<GlobalLoading />}>
            <RouterProvider router={router} />
          </Suspense>
        </CartProvider>
      </AuthProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
