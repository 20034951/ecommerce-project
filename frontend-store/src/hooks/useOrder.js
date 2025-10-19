import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api';

/**
 * Hook para obtener los detalles de un pedido específico
 * @param {string|number} orderId - ID del pedido
 * @returns {Object} Query result con data, isLoading, error, refetch
 */
export function useOrder(orderId) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: !!orderId, // Solo ejecuta si hay orderId
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
