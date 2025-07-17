import { useLocation, useNavigate } from "react-router-dom";
import { useSigninMutation } from "../hooks/userHooks";
import { useEffect } from "react";
import { useContext } from "react";
import type { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import AuthForm from "../components/AuthForm";
import { Store } from "../Store";
import { toast } from "react-toastify"
import { useDocumentTitle } from "../hooks/titleHooks";

const SigninPage: React.FC = () => {
    useDocumentTitle('Sign in')
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl || '/'

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state;

    const { mutateAsync: signin } = useSigninMutation()

    useEffect(() => {
        if (userInfo) 
            navigate(redirect)
    }, [navigate, redirect, userInfo])

    const handleSignIn = async (data: { email: string; password: string }) => {
        try {
            const result = await signin(data);
            dispatch({ type: 'USER_SIGNIN', payload: result });
            localStorage.setItem('userInfo', JSON.stringify(result));
            navigate(redirect)
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    }

    return <AuthForm mode='signin' onSubmit={handleSignIn} />
}

export default SigninPage