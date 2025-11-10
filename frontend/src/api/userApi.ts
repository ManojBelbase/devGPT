import api from './axiosInstance';
export const getCurrentUser = () => api.get('api/user/current');
export const registerUser = () => api.post('api/user/register');
export const loginUser = (credentials: { email: string; password: string }) =>
    api.post('api/user/login', credentials);
export const logout = () => api.get('/api/user/logout');
