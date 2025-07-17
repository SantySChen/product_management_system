import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import type { UserInfo } from "../types/UserInfo";
import { getError } from "../utils";
import { toast } from "react-toastify";
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

interface CheckEmailInput {
  email: string;
}

interface CheckEmailResponse {
  exists: boolean;
}

export const useCheckEmailMutation = () =>
  useMutation<CheckEmailResponse, Error, CheckEmailInput>({
    mutationFn: async ({ email }) => {
      const { data } = await apiClient.post<CheckEmailResponse>(
        '/api/users/check-email',
        { email }
      );
      return data;
    },
    onError: (error) => {
      toast.error(getError(error as unknown as ApiError));
    },
  });