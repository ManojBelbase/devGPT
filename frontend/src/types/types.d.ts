export interface AppContextType {
    navigate: ReturnType<typeof useNavigate>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export interface AppContextType {
    theme: string;
    setTheme: (theme: string) => void;
    navigate: ReturnType<typeof useNavigate>;
};


export type ChatContextType = {
    chats: any[];
    selectedChat: any | null;
    setSelectedChat: (chat: any | null) => void;
    refreshChats: () => Promise<void>;
    setChats: React.Dispatch<React.SetStateAction<any[]>>
};

export type AuthCtx = {
    user: any | null;
    loading: boolean;
    login: (e: string, p: string) => Promise<void>;
    logout: () => Promise<void>;
};


// ---------------------------------------------------------------------
// Types (adjust to your real backend shape)
// ---------------------------------------------------------------------
export interface Message {
    role: 'user' | 'assistant';
    content?: string;
    type?: 'text' | 'image';
    // … any other fields you receive
}

export interface Chat {
    _id: string;
    title: string;
    messages: Message[];
    userId: string;
    updatedAt: string;
    createdAt?: string;
    // … any other fields
}