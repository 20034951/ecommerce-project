import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook para actualizar el estado de un pedido (Admin)
 * @returns {Object} Mutation result con mutate, mutateAsync, isLoading, error, isSuccess
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, statusData }) => 
      ordersApi.updateOrderStatus(orderId, statusData),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries(['admin-order', variables.orderId]);
      queryClient.invalidateQueries(['admin-orders']);
      queryClient.invalidateQueries(['admin-order-stats']);
    },
  });
}
