// context/ChatContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getChats } from '../api/chatApi';
import { useAuth } from './AuthContext';
import type { ChatContextType } from '../types/types';


const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const { user } = useAuth();

    const refreshChats = async () => {
        if (!user) {
            setChats([]);
            return;
        }
        try {
            const { data } = await getChats();
            setChats(data.data || data);
        } catch (err) {
            setChats([]);
        }
    };

    useEffect(() => {
        refreshChats();
    }, [user]);

    useEffect(() => {
        const handleFocus = () => {
            if (user) refreshChats();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

    return (
        <ChatContext.Provider value={{ chats, setChats, selectedChat, setSelectedChat, refreshChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChats = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChats must be used within ChatProvider');
    return context;
};