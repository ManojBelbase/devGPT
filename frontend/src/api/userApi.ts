// src/api/userApi.ts
import api from './axiosInstance';

export const getCurrentUser = () => api.get('api/user/data');
export const registerUser = () => api.post('api/user/register');
export const loginUser = (credentials: { email: string; password: string }) =>
    api.post('api/user/login', credentials);
export const logout = () => api.post('/auth/logout');