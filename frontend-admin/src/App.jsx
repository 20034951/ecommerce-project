import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ThemeController } from './components/theme/ThemeController.jsx';
import { router } from './router/index.jsx';
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
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner animado personalizado */}
        <div className="relative inline-flex">
          {/* Anillo exterior giratorio */}
          <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-900/30 rounded-full"></div>
          
          {/* Anillo giratorio con gradiente */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          
          {/* Punto central pulsante */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Texto con animación */}
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white animate-pulse">
            Cargando panel administrativo
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
          </div>
        </div>
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
