import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import shippingMethodsApi from '../api/shippingMethods';

/**
 * Hook para obtener todos los métodos de envío
 */
export function useShippingMethods() {
  return useQuery({
    queryKey: ['shipping-methods'],
    queryFn: () => shippingMethodsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener un método de envío por ID
 */
export function useShippingMethod(id) {
  return useQuery({
    queryKey: ['shipping-method', id],
    queryFn: () => shippingMethodsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para crear un método de envío
 */
export function useCreateShippingMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => shippingMethodsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
    },
  });
}

/**
 * Hook para actualizar un método de envío
 */
export function useUpdateShippingMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => shippingMethodsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-method', variables.id] });
    },
  });
}

/**
 * Hook para eliminar un método de envío
 */
export function useDeleteShippingMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => shippingMethodsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
    },
  });
}
