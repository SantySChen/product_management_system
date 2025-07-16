import { useContext } from "react";
import { Store } from "../Store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    return userInfo ? <Outlet /> : <Navigate to='/signin' />
}

export default ProtectedRoute;