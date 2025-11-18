import axios from "axios";
import { refreshToken } from "../redux/thunks/authThunk";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // prevent infinite loop for refresh request
        if (originalRequest.url.includes("/user/refresh")) {
            store.dispatch(logout());
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await store.dispatch(refreshToken()).unwrap();
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;