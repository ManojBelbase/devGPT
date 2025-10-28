// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCurrentUser, loginUser, logout as apiLogout } from "../api/userApi";

type AuthCtx = {
    user: any | null;
    loading: boolean;
    login: (e: string, p: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const { data } = await getCurrentUser();
            console.log('API Response:', data); // Keep this for debugging

            // Your backend format
            if (data.status === "success" && data.data) {
                setUser(data.data); // data.data = user object
            } else {
                setUser(null);
            }
        } catch (err: any) {
            console.log('Load user error:', err.response?.data);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await apiLogout();                     // clear any old cookie
            const { data } = await loginUser({ email, password });
            if (!data.success) throw new Error(data.message);
            await loadUser();                      // <-- refetch with new cookie
            toast.success("Logged in!");
        } catch (e: any) {
            toast.error(e.message || "Login failed");
            throw e;
        }
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
        toast.success("Logged out");
        window.location.href = "/login";
    };

    useEffect(() => { loadUser(); }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthCtx => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};