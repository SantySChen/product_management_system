import {
  useQuery,
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../apiClient";
import type { Cart } from "../types/Cart";

// Get current cart
export const useGetCartQuery = () =>
  useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => (await apiClient.get<Cart>("/api/cart")).data,
    staleTime: 0,
  });

// get quantity
export const useGetCartItemQuantity = (productId: string) =>
  useQuery<number>({
    queryKey: ["cartItemQuantity", productId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ quantity: number }>(
        `/api/cart/item/${productId}/quantity`
      );
      return data.quantity;
    },
    enabled: Boolean(productId),
    staleTime: 60000,
  });

// Add 1 quantity to cart
type AddToCartPayload = { productId: string; quantity?: number };

export const useAddToCartMutation = (options?: {
  onSuccess?: (data: Cart) => void;
}): UseMutationResult<Cart, Error, AddToCartPayload, unknown> => {
  return useMutation<Cart, Error, AddToCartPayload>({
    mutationFn: async ({ productId, quantity }) =>
      (
        await apiClient.post<Cart>("/api/cart/add", {
          productId,
          quantity,
        })
      ).data,
    ...options,
  });
};

// Decrease 1 quantity in cart
export const useDecreaseCartItemMutation = (options?: {
  onSuccess?: (data: Cart) => void;
}): UseMutationResult<Cart, Error, string, unknown> => {
  return useMutation<Cart, Error, string>({
    mutationFn: async (productId: string) =>
      (await apiClient.post<Cart>("/api/cart/decrease", { productId })).data,
    ...options,
  });
};

// Remove item from cart
export const useRemoveCartItemMutation = (options?: {
  onSuccess?: (data: Cart) => void;
}): UseMutationResult<Cart, Error, string, unknown> => {
  return useMutation<Cart, Error, string>({
    mutationFn: async (productId: string) =>
      (await apiClient.post<Cart>("/api/cart/remove", { productId })).data,
    ...options,
  });
};

// checkout
export const useCheckoutMutation = (options?: {
  onSuccess?: (data: Cart) => void;
}): UseMutationResult<Cart, Error, void, unknown> => {
  return useMutation<Cart, Error, void>({
    mutationFn: async () =>
      (await apiClient.post<Cart>("/api/cart/checkout")).data,
    ...options,
  });
};

export const useApplyDiscountMutation = (options?: {
  onSuccess?: (data: Cart) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<Cart, Error, { code: string }>({
    mutationFn: async ({ code }) =>
      (await apiClient.post<Cart>("/api/cart/discount", { code })).data,
    ...options,
  });
};
