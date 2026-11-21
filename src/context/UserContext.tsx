import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { nameFromEmail } from '../utils/user';

export type User = {
    name: string;
    email: string;
    phone: string;
    bio: string;
};

type UserValue = {
    user: User | null;
    signIn: (email: string) => void;
    signUp: (name: string, email: string) => void;
    signOut: () => void;
    updateUser: (patch: Partial<User>) => void;
};

const UserContext = createContext<UserValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const signIn = useCallback((email: string) => {
        setUser((current) => {
            if (current && current.email === email) return current;
            return { name: nameFromEmail(email), email, phone: '', bio: '' };
        });
    }, []);

    const signUp = useCallback((name: string, email: string) => {
        setUser({ name, email, phone: '', bio: '' });
    }, []);

    const signOut = useCallback(() => setUser(null), []);

    const updateUser = useCallback((patch: Partial<User>) => {
        setUser((current) => (current ? { ...current, ...patch } : current));
    }, []);

    const value = useMemo(() => ({ user, signIn, signUp, signOut, updateUser }), [user, signIn, signUp, signOut, updateUser]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser нужно использовать внутри UserProvider');
    }
    return context;
}