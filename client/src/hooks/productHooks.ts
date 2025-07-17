import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";
import type { Product } from '../types/Product'

export const useGetProductsQuery = (sort: string = 'sort/latest', page = 1, limit = 10) =>
  useQuery({
    queryKey: ['products', sort, page],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: Product[];
          page: number;
          pages: number;
          total: number;
        }>(`api/products/${sort}?page=${page}&limit=${limit}`)
      ).data,
  });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) =>
      (await apiClient.post<Product>(`api/products`, product)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // refresh product list
    },
  });
};

export const useGetProductById = (id: string) => 
    useQuery({
        queryKey: ['product', id],
        queryFn: async () => 
            (await apiClient.get<Product>(`api/products/product/${id}`)).data,
        enabled: !!id,
    })

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, product }: { id: string; product: Product}) =>
            (await apiClient.put<Product>(`api/products/product/${id}`, product)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<{ message: string }>(`api/products/product/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useSearchProductsQuery = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`/api/products/search?q=${query}`)).data,
    enabled: !!query, 
  });