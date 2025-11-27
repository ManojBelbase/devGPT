import axios from "axios";
import { refreshToken } from "../redux/thunks/authThunk";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

// Create instance
const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? import.meta.env.VITE_API_LOCAL
            : import.meta.env.VITE_API_PROD,
    withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Endpoints that should NEVER trigger refresh
        const publicEndpoints = [
            "/user/login",
            "/user/register",
            "/user/refresh",
        ];

        const isPublicEndpoint = publicEndpoints.some((endpoint) =>
            originalRequest.url.includes(endpoint)
        );

        // If it is a public endpoint → DO NOT REFRESH
        if (isPublicEndpoint) {
            return Promise.reject(error);
        }

        // If protected endpoint returns 401 → refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try refresh
                const result = await store.dispatch(refreshToken()).unwrap();

                // Save new accessToken from backend response
                if (result?.data?.accessToken) {
                    localStorage.setItem("accessToken", result.data.accessToken);
                }

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Logout user if refresh fails
                store.dispatch(logout());
                return Promise.reject({ silent: true, cause: refreshError });
            }
        }

        return Promise.reject(error);
    }
);

export default api;
