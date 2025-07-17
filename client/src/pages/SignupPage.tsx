import { useLocation, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../hooks/userHooks";
import type { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import { toast } from "react-toastify";
import AuthForm from "../components/AuthForm";
import { Store } from "../Store";
import { useContext } from "react";
import { useEffect } from "react";
import { useDocumentTitle } from "../hooks/titleHooks";

const SignupPage: React.FC = () => {
    useDocumentTitle('Sign up')
    const navigate = useNavigate();
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'
    const { mutateAsync: signup } = useSignupMutation();

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    useEffect(() => {
        if (userInfo && location.pathname !== '/signup') {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const handleSignUp = async (data: { email: string; password: string }) => {
        try {
            const result = await signup({
                email: data.email,
                password: data.password,
            })
            dispatch({ type: 'USER_SIGNIN', payload: result })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect)
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    };
    return <AuthForm mode='signup' onSubmit={handleSignUp} />
}

export default SignupPage;