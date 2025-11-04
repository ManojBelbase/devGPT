// api/axiosInstance.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'https://devgptai.vercel.app/',
    withCredentials: true,
});

// Optional: Global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
        } else {
            const msg = error.response?.data?.message || 'Something went wrong';
            toast.error(msg);
        }
        return Promise.reject(error);
    }
);

export default api;