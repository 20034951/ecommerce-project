import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ThemeController } from './components/theme/ThemeController.jsx';
import { router } from './router/index.jsx';
import { Spinner } from './components/ui';
import ErrorBoundary from './components/layout/ErrorBoundary.jsx';
import './App.css';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="xl" className="text-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando panel administrativo...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ThemeController />
          <AuthProvider>
            <Suspense fallback={<GlobalLoading />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
