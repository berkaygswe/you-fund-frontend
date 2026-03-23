// middleware.ts
// Uses a simple flag cookie for redirect decisions.
// This is NOT a security boundary — just UX redirects.
// Real auth is validated by the backend on every API call.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/profile'];
const AUTH_PAGES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has('logged_in');

  // ROOT → redirect logged-in users to market overview
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/market-overview', request.url));
    }
    return NextResponse.next();
  }

  // PROTECTED routes → redirect unauthenticated to login
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // AUTH pages → redirect already-logged-in users away
  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/market-overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
};