// hooks/useAuth.tsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';
import type { ReactNode } from 'react';
import { User, AuthStatus, LoginRequest, RegisterRequest } from '@/types/auth';
import { authClient, setAccessToken } from '@/lib/auth-client';
import { createSessionAction, deleteSessionAction } from '@/lib/auth-actions';

interface AuthContextType {
    user: User | null;
    status: AuthStatus;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    hasSessionHint: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_REFRESH_MS = 13 * 60 * 1000; // 13 minutes — before the 15-min expiry

export function AuthProvider({ children, initialSessionHint = false }: { children: ReactNode, initialSessionHint?: boolean }) {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');
    const isRefreshing = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /**
     * Attempts a silent refresh using the backend's HttpOnly refresh token cookie.
     * On success: sets access token in memory + fetches full user profile.
     * On failure: marks user as unauthenticated and clears the flag cookie.
     */
    const silentRefresh = useCallback(async (): Promise<boolean> => {
        if (isRefreshing.current) return false;
        isRefreshing.current = true;

        try {
            const data = await authClient.refresh();
            setAccessToken(data.accessToken);

            const userData = await authClient.getCurrentUser();
            setUser(userData);
            setStatus('authenticated');
            return true;
        } catch (error: any) {
            setAccessToken(null);
            setUser(null);
            setStatus('unauthenticated');
            
            // Only clear the session cookie if the token is explicitly invalid (401 or 403).
            // If the Java backend is down (network error or 5xx), keep the hint cookie
            // so they can seamlessly log back in when the server comes back online.
            if (error?.status === 401 || error?.status === 403) {
                await deleteSessionAction();
            }
            return false;
        } finally {
            isRefreshing.current = false;
        }
    }, []);

    // Start periodic token refresh
    const startRefreshInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            silentRefresh();
        }, ACCESS_TOKEN_REFRESH_MS);
    }, [silentRefresh]);

    // Stop periodic token refresh
    const stopRefreshInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Initial silent refresh on mount
    useEffect(() => {
        if (initialSessionHint) {
            silentRefresh().then((ok) => {
                if (ok) startRefreshInterval();
            });
        } else {
            setStatus('unauthenticated');
        }

        return () => stopRefreshInterval();
    }, [silentRefresh, startRefreshInterval, stopRefreshInterval, initialSessionHint]);

    const login = useCallback(async (data: LoginRequest) => {
        try {
            const authData = await authClient.login(data);
            setAccessToken(authData.accessToken);

            const userData = await authClient.getCurrentUser();
            setUser(userData);
            setStatus('authenticated');

            await createSessionAction(userData.email);
            startRefreshInterval();
        } catch (error) {
            setStatus('unauthenticated');
            throw error;
        }
    }, [startRefreshInterval]);

    const register = useCallback(async (data: RegisterRequest) => {
        try {
            const authData = await authClient.register(data);
            setAccessToken(authData.accessToken);

            const userData = await authClient.getCurrentUser();
            setUser(userData);
            setStatus('authenticated');

            await createSessionAction(userData.email);
            startRefreshInterval();
        } catch (error) {
            setStatus('unauthenticated');
            throw error;
        }
    }, [startRefreshInterval]);

    const logout = useCallback(async () => {
        stopRefreshInterval();
        try {
            await authClient.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
            setStatus('unauthenticated');
            await deleteSessionAction();
        }
    }, [stopRefreshInterval]);

    return (
        <AuthContext.Provider value={{ user, status, login, register, logout, hasSessionHint: initialSessionHint }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}