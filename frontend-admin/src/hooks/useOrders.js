import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook para obtener la lista completa de pedidos (Admin)
 * @param {Object} filters - Filtros de búsqueda
 * @param {Object} pagination - Configuración de paginación
 * @returns {Object} Query result con data, isLoading, error, refetch
 */
export function useOrders(filters = {}, pagination = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: ['admin-orders', filters, pagination],
    queryFn: () => ordersApi.getAllOrders({ ...filters, ...pagination }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
