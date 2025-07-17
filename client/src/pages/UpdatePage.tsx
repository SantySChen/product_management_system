import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useContext, useEffect } from "react";
import { Store } from "../Store";
import type { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { useDocumentTitle } from "../hooks/titleHooks";
import { useCheckEmailMutation } from "../hooks/userHooks";

const UpdatePage: React.FC = () => {
    useDocumentTitle('Update')
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/emailsent';

    const { state } = useContext(Store);
    const { userInfo } = state;

    const { mutateAsync: checkEmail } = useCheckEmailMutation()

    useEffect(() => {
        if (userInfo && location.pathname !== '/update') 
            navigate(redirect);
    }, [navigate, redirect, userInfo]);

    const sendEmail = async ({ email }: { email: string }) => {
        try {
            const result = await checkEmail({ email });
            if (result.exists) {
                toast.success("Email found. Redirecting...");
                navigate("/emailsent");
            } else {
                toast.error("This email is not registered.");
            }
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    };
    return <AuthForm mode='update' onSubmit={sendEmail} />
}
export default UpdatePage;

