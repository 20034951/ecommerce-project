import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook para obtener estadísticas de pedidos (Admin)
 * @param {Object} filters - Filtros para las estadísticas (dateFrom, dateTo)
 * @returns {Object} Query result con data, isLoading, error, refetch
 */
export function useOrderStats(filters = {}) {
  return useQuery({
    queryKey: ['admin-order-stats', filters],
    queryFn: () => ordersApi.getOrderStats(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
