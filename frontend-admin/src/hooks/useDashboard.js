import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboardApi';

/**
 * Hook para obtener estadísticas del dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
}

/**
 * Hook para obtener productos con stock bajo
 */
export function useLowStockProducts(threshold = 10) {
  return useQuery({
    queryKey: ['low-stock-products', threshold],
    queryFn: () => dashboardApi.getLowStockProducts(threshold),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener pedidos recientes
 */
export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: () => dashboardApi.getRecentOrders(limit),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}
