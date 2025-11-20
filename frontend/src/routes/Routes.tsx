// src/router/appRoutes.tsx (or wherever your routes file is)
import ChatBox from "../components/ChatBox";
import { FronendRoutes } from "../constant/FrontendRoutes";
import Layout from "../layout/Layout";
import CommunityPageIndex from "../pages/community/CommunityPageIndex";
import CreditPageIndex from "../pages/credit/CreditPageIndex";
import PaymentSuccess from "../pages/credit/PaymentSuccess";
import LoginPageIndex from "../pages/login/LoginPageIndex";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Navigate } from "react-router-dom"; // ← ADD THIS

export const appRoutes = [
    // Public Routes
    {
        path: FronendRoutes.LOGIN,
        element: (
            <PublicRoute>
                <LoginPageIndex />
            </PublicRoute>
        ),
    },

    // Protected Layout (Sidebar + Outlet)
    {
        path: FronendRoutes.HOME, // this is "/" 
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            // 1. Redirect "/" → "/chat" automatically
            { index: true, element: <Navigate to={FronendRoutes.CHAT} replace /> },

            // 2. Explicit /chat route
            { path: FronendRoutes.CHAT, element: <ChatBox /> },

            // Other protected pages
            { path: FronendRoutes.COMMUNITY, element: <CommunityPageIndex /> },
            { path: FronendRoutes.CREDITS, element: <CreditPageIndex /> },
            { path: FronendRoutes.PAYMENT_SUCCESS, element: <PaymentSuccess /> },

            // Optional: Catch-all redirect (if someone types wrong URL under /)
            { path: "*", element: <Navigate to={FronendRoutes.CHAT} replace /> },
        ],
    },

    // Optional: Global fallback (if someone goes to unknown route)
    { path: "*", element: <Navigate to={FronendRoutes.LOGIN} replace /> },
];