import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { getCurrentUser, loginUser, logout as apiLogout } from "../api/userApi";
import type { AuthCtx } from "../types/types";
import { useAppContext } from "./AppContext";

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const { navigate } = useAppContext();
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false);

    const loadUser = useCallback(async (silent = false) => {
        try {
            const { data } = await getCurrentUser();

            // Handle both "status" and "success" fields for consistency
            const isSuccess = data.status === "success" || data.success === true;

            if (isSuccess && data.data) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err: any) {
            // Don't log or show errors for 401 (user not logged in)
            if (err.response?.status !== 401 && !silent) {
                console.error('Error loading user:', err.response?.data || err.message);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            const { data } = await loginUser({ email, password });

            // Handle both "status" and "success" fields
            const isSuccess = data.status === "success" || data.success === true;

            if (!isSuccess) {
                throw new Error(data.message || "Login failed");
            }

            // Reload user data after successful login
            await loadUser(true);

            toast.success("Logged in successfully!");
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || e.message || "Login failed";
            toast.error(errorMessage);
            setLoading(false);
            throw e;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await apiLogout();
        } catch (err) {
            console.error('Logout API error:', err);
        } finally {
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/login"); // ✅ client-side navigation, no refresh
        }
    };

    // CRITICAL: Only initialize ONCE
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initAuth = async () => {
            await loadUser(true);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthCtx => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};