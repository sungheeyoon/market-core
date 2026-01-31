'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { User } from '@/domain/entities/User';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        // Mock login
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser({
            id: 'user-1',
            email: email,
            name: 'Demo User'
        });
    };

    const logout = () => {
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        login,
        logout
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
