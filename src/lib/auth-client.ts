// lib/auth-client.ts
import { LoginRequest, RegisterRequest, AuthenticationResponse, User } from '@/types/auth';

class AuthClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // This ensures cookies are sent
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      console.log(response)
      const error = await response.text();
      throw new Error(error || 'An error occurred');
    }

    // Check for empty response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // @ts-expect-error - allow void return for empty response
      return; // Return undefined (void) for empty body
    }
  }

  async register(data: RegisterRequest): Promise<AuthenticationResponse> {
    return this.request<AuthenticationResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    });
  }

  async login(data: LoginRequest): Promise<AuthenticationResponse> {
    return this.request<AuthenticationResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  }

  async getCurrentUser(token?: string): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'GET',
      credentials: 'include',
      headers: token
        ? {
            Cookie: `jwt=${token}`, // ✅ explicitly send cookie for SSR
          }
        : undefined,
    });
  }


  async refreshToken(): Promise<AuthenticationResponse> {
    return this.request<AuthenticationResponse>('/auth/refresh', {
      method: 'POST',
    });
  }
}

export const authClient = new AuthClient();