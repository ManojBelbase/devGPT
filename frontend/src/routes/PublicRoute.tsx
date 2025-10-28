// components/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { JSX } from "react";

interface PublicRouteProps {
    children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user } = useAppContext();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
