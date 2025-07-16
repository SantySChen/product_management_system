import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useUpdateMutation } from "../hooks/userHooks";
import { useContext, useEffect } from "react";
import { Store } from "../Store";
import type { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { useDocumentTitle } from "../hooks/titleHooks";

const UpdatePage: React.FC = () => {
    useDocumentTitle('Update')
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/emailsent';

    const { state } = useContext(Store);
    const { userInfo } = state;

    const { mutateAsync: update } = useUpdateMutation();

    useEffect(() => {
        if (userInfo) 
            navigate(redirect);
    }, [navigate, redirect, userInfo]);

    const sendEmail = async ({ email }: { email: string; password: string }) => {
        try {
            await update({ email });
            toast.success('Password recovery email sent.Check your inbox!');
        } catch (err) {
            toast.error(getError(err as ApiError));
        }
    }
    return <AuthForm mode='update' onSubmit={sendEmail} />
}
export default UpdatePage;