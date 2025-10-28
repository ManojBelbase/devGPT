// components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
    children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, loading } = useAuth(); // Use loading!

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />; // or "/dashboard"
    }

    return children;
};

export default PublicRoute;