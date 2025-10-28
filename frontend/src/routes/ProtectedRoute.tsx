// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAppContext();

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
