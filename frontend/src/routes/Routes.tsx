// src/router/appRoutes.tsx

import { Navigate } from "react-router-dom";
import PaymentSuccess from "../pages/credit/PaymentSuccess"; // ← Import here
import { FronendRoutes } from "../constant/FrontendRoutes";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import Layout from "../layout/Layout";
import CommunityPageIndex from "../pages/community/CommunityPageIndex";
import ChatBox from "../components/ChatBox";
import CreditPageIndex from "../pages/credit/CreditPageIndex";
import LoginPageIndex from "../pages/login/LoginPageIndex";

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

    // ← ADD THIS: Payment success must be PUBLIC (not protected!)
    {
        path: FronendRoutes.PAYMENT_SUCCESS,
        element: <PaymentSuccess />, // ← No ProtectedRoute wrapper!
    },

    // Protected Layout (everything else)
    {
        path: FronendRoutes.HOME,
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to={FronendRoutes.CHAT} replace /> },
            { path: FronendRoutes.CHAT, element: <ChatBox /> },
            { path: FronendRoutes.COMMUNITY, element: <CommunityPageIndex /> },
            { path: FronendRoutes.CREDITS, element: <CreditPageIndex /> },
            { path: "*", element: <Navigate to={FronendRoutes.CHAT} replace /> },
        ],
    },

    // Global fallback
    { path: "*", element: <Navigate to={FronendRoutes.LOGIN} replace /> },
];