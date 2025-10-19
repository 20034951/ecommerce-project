import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api';

/**
 * Hook para obtener la lista de pedidos del usuario
 * @param {Object} filters - Filtros de búsqueda (status, dateFrom, dateTo, search)
 * @param {Object} pagination - Paginación (page, limit)
 * @returns {Object} Query result con data, isLoading, error, refetch
 */
export function useOrders(filters = {}, pagination = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ['orders', filters, pagination],
    queryFn: () => ordersApi.getOrders({ ...filters, ...pagination }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
