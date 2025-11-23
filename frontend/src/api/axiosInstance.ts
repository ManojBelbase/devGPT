import axios from "axios";
import { refreshToken } from "../redux/thunks/authThunk";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? import.meta.env.VITE_API_LOCAL
            : import.meta.env.VITE_API_PROD,
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // List of endpoints that should NEVER trigger refresh
        const publicEndpoints = [
            "/user/login",
            "/user/register",
            "/user/refresh",
        ];

        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            originalRequest.url.includes(endpoint)
        );

        // If it's a public endpoint (login/register/refresh) → don't retry
        if (isPublicEndpoint) {
            return Promise.reject(error);
        }

        // Only for protected routes: trigger refresh on 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await store.dispatch(refreshToken()).unwrap();
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject({ silent: true, cause: refreshError });
            }
        }

        return Promise.reject(error);
    }
);


export default api;