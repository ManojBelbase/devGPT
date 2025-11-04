import type { Chat } from '../types/types';
import api from './axiosInstance';

export const getChats = () => api.get<Chat[]>('/api/chat');

export const createChat = () =>
    api.post<{ chat: Chat }>('/api/chat/create');

export const deleteChat = (data: { chatId: string }) =>
    api.delete('/api/chat/delete', { data });

export const generateText = (data: {
    prompt: string;
    chatId?: string;
}) => api.post('/api/message/text', data);

export const generateImage = (data: {
    prompt: string;
    chatId?: string;
}) => api.post('/api/message/image', data);