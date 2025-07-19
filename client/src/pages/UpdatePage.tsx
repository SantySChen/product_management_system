import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useContext, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
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

    const { mutateAsync: checkEmailMutation } = useCheckEmailMutation()

    useEffect(() => {
        if (userInfo && location.pathname !== '/update') 
            navigate(redirect);
    }, [navigate, redirect, userInfo]);

    const checkEmail = async (email: string): Promise<boolean> => {
    try {
      const res = await checkEmailMutation({ email });
      return res.exists;
    } catch {
      return false;
    }
  };

    const sendEmail = async () => {
        toast.success('Recovery link sent')
    };
    return <AuthForm mode='update' onSubmit={sendEmail} checkEmail={checkEmail}/>
}
export default UpdatePage;

