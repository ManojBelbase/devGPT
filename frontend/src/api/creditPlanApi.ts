import api from './axiosInstance';

export const getPlans = () => api.get<any[]>('payment/plans');