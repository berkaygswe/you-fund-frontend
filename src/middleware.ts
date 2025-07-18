// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authClient } from './lib/auth-client';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return false;
  }
  /* Uncomment this block if you want to validate the JWT token
    try {
      // Call /me with the JWT token
      const user = await authClient.getCurrentUser(token)
      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return false;
    }
  */
  return true;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/profile'];
  const publicPaths = ['/login', '/signup'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  const authenticated = await isAuthenticated(request);

  if (pathname === '/') {
    if (authenticated) {
      return NextResponse.redirect(new URL('/market-overview', request.url));
    }
    return NextResponse.next();
  }

  if (isProtected && !authenticated) {
    // Not authenticated, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Clear potentially invalid token
    response.cookies.delete('jwt');
    return response;
  }

  if (isPublic && authenticated) {
    // Already authenticated, redirect away from login/signup
    return NextResponse.redirect(new URL('/market-overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
};