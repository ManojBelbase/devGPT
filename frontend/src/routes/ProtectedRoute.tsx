import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../types/types";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Render protected content
    return <>{children}</>;
};

export default ProtectedRoute;