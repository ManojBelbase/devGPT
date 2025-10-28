// api/chatApi.ts
import api from './axiosInstance';

export const getChats = () => api.get('/chats');