import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook para obtener los detalles de un pedido específico (Admin)
 * @param {string|number} orderId - ID del pedido
 * @returns {Object} Query result con data, isLoading, error, refetch
 */
export function useOrder(orderId) {
  return useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: async () => {
      const response = await ordersApi.getOrderById(orderId);
      // El backend devuelve { success: true, data: {...} }
      // Extraer solo los datos del pedido
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
