// lib/auth-client.ts
import { LoginRequest, RegisterRequest, AuthenticationResponse, User, AuthError } from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

function onRefreshed(token: string) {
    refreshSubscribers.map((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

export class AuthApiError extends Error {
    status: number;
    data: AuthError;

    constructor(status: number, data: AuthError) {
        super(data.message || 'Authentication error');
        this.status = status;
        this.data = data;
        this.name = 'AuthApiError';
    }
}

async function refreshAccessToken(): Promise<AuthenticationResponse> {
    if (isRefreshing) {
        return new Promise<AuthenticationResponse>((resolve, reject) => {
            addRefreshSubscriber((token) => resolve({ accessToken: token, email: '', tokenType: 'Bearer' }));
            // Timeout after 10s
            setTimeout(() => reject(new Error('Refresh timeout')), 10000);
        });
    }

    isRefreshing = true;
    try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshRes.ok) {
            const data: AuthenticationResponse = await refreshRes.json();
            accessToken = data.accessToken;
            onRefreshed(data.accessToken);
            return data;
        } else {
            accessToken = null;
            throw new Error('Refresh failed');
        }
    } catch (error) {
        accessToken = null;
        throw error;
    } finally {
        isRefreshing = false;
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        credentials: 'include',
        ...options,
        headers,
    };

    let response = await fetch(url, config);

    // Handle 401 Unauthorized - try refresh
    if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
        try {
            const data = await refreshAccessToken();
            const newToken = data.accessToken;
            // Retry with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, { ...config, headers });
        } catch (error) {
            // Refresh failed, let the 401 error propagate or handle it
            throw error;
        }
    }

    if (!response.ok) {
        let errorData: AuthError;
        try {
            errorData = await response.json();
        } catch {
            errorData = {
                status: response.status,
                error: 'UNKNOWN_ERROR',
                message: await response.text() || 'An unexpected error occurred'
            };
        }
        throw new AuthApiError(response.status, errorData);
    }

    if (response.status === 204) return {} as T;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return {} as T;
}

export const authClient = {
    register: (data: RegisterRequest) =>
        request<AuthenticationResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: LoginRequest) =>
        request<AuthenticationResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    logout: () =>
        request<void>('/auth/logout', {
            method: 'POST',
        }),

    getCurrentUser: () =>
        request<User>('/auth/me', {
            method: 'GET',
        }),

    refresh: () => refreshAccessToken(),
};

export { request as authRequest };
