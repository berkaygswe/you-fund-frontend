export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  email: string;
  tokenType: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  authProvider: 'LOCAL' | 'GOOGLE';
  role?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthError {
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
