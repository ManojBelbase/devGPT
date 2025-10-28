
import ChatBox from "../components/ChatBox";
import { FronendRoutes } from "../constant/FrontendRoutes";
import Layout from "../layout/Layout";
import CommunityPageIndex from "../pages/community/CommunityPageIndex";
import CreditPageIndex from "../pages/credit/CreditPageIndex";
import LoginPageIndex from "../pages/login/LoginPageIndex";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";


export const appRoutes = [
    {
        path: FronendRoutes.LOGIN,
        element: (
            <PublicRoute>
                <LoginPageIndex />
            </PublicRoute>
        ),
    },
    {
        path: FronendRoutes.HOME,
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <ChatBox /> },
            { path: FronendRoutes.COMMUNITY, element: <CommunityPageIndex /> },
            { path: FronendRoutes.CREDITS, element: <CreditPageIndex /> },
        ],
    },
];
