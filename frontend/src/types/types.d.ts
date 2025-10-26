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