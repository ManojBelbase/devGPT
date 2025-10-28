// src/context/RootProvider.tsx
import { AppContextProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';

export const RootProvider = ({ children }: { children: React.ReactNode }) => (
    <AppContextProvider>
        <AuthProvider>
            <ChatProvider>{children}</ChatProvider>
        </AuthProvider>
    </AppContextProvider>
);