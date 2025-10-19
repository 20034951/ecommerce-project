import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api';

/**
 * Hook para cancelar un pedido
 * @returns {Object} Mutation result con mutate, mutateAsync, isLoading, error, isSuccess
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) => ordersApi.cancelOrder(orderId, reason),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries(['order', variables.orderId]);
      queryClient.invalidateQueries(['orders']);
    },
  });
}
