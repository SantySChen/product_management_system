import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import type { Product } from '../types/Product'

export const useGetProductsQuery = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (await apiClient.get<Product[]>('api/products')).data,
    })

export const useCreateProductMutation = () => 
    useMutation({
        mutationFn: async (product: Product) =>
        (await apiClient.post<Product>('api/products', product)).data,
    })