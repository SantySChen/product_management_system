import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import type { UserInfo } from "../types/UserInfo";
import { toast } from "react-toastify";
import { getError } from "../utils";
import type { ApiError } from "../types/ApiError";

export const useSigninMutation = () => useMutation({
    mutationFn: async ({
        email,
        password,
    }: {
        email: string
        password: string
    }) => 
    (
        await apiClient.post<UserInfo>('api/users/signin', {
            email,
            password,
        })
    ).data
})

export const useSignupMutation = () => useMutation({
    mutationFn: async ({
        email,
        password,
    }: {
        email: string
        password: string
    }) => 
        (
            await apiClient.post<UserInfo>('api/users/signup', {
                email,
                password,
            })
        ).data
})

export const useUpdateMutation = () => useMutation({
    mutationFn: async ({ email }: { email: string }) => {
        const { data } = await apiClient.post<UserInfo>('api/users/update', {
            email,
        });
        return data;
    },
    onError: (error) => {
        toast.error(getError(error as unknown as ApiError));
    },
})