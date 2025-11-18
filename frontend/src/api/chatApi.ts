import type { Chat } from '../types/types';
import api from './axiosInstance';

export const getChats = () => api.get<Chat[]>('/chat');

export const createChat = () =>
    api.post<{ chat: Chat }>('/chat/create');

export const deleteChat = (data: { chatId: string }) =>
    api.delete('/chat/delete', { data });

export const generateText = (data: {
    prompt: string;
    chatId?: string;
}) => api.post('/message/text', data);

export const generateImage = (data: {
    prompt: string;
    chatId?: string;
}) => api.post('/message/image', data);