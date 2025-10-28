import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppContextType } from '../types/types';

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

    const fetchUser = async () => {
        try {
            // Replace with actual API call
            const response = await fetch('/api/user');
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        }
    };

    const fetchUserChats = async () => {
        if (!user) {
            setChats([]);
            setSelectedChat(null);
            return;
        }
        try {
            // Replace with actual API call
            const response = await fetch('/api/chats');
            const chatData = await response.json();
            setChats(chatData);
        } catch (error) {
            console.error('Failed to fetch chats:', error);
            setChats([]);
            setSelectedChat(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchUserChats();
    }, [user]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const value: AppContextType = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};