import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) return <Navigate to="/login" replace />;
    return children;
};  
