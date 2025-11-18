import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { JSX } from "react";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    // if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (user) return <Navigate to="/" replace />;
    return children;
};
