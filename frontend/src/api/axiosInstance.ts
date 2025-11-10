import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url;

        // Skip redirect for session-check APIs
        if (error.response?.status === 401 && !url?.includes('/user/current')) {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
        } else if (error.response) {
            const msg = error.response.data?.message || 'Something went wrong';
            toast.error(msg);
        } else {
            toast.error('Network error. Please try again.');
        }

        return Promise.reject(error);
    }
);


export default api;