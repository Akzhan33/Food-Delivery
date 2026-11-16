import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { nameFromEmail } from '../utils/user';

export type User = {
    name: string;
    email: string;
};

type UserValue = {
    user: User | null;
    signIn: (email: string) => void;
    signUp: (name: string, email: string) => void;
    signOut: () => void;
};

const UserContext = createContext<UserValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const signIn = useCallback((email: string) => {
        setUser((current) => ({
            name: current && current.email === email ? current.name : nameFromEmail(email),
            email,
        }));
    }, []);

    const signUp = useCallback((name: string, email: string) => {
        setUser({ name, email });
    }, []);

    const signOut = useCallback(() => setUser(null), []);

    const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser нужно использовать внутри UserProvider');
    }
    return context;
}