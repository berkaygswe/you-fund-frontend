// middleware.ts
// Uses a simple flag cookie for redirect decisions.
// This is NOT a security boundary — just UX redirects.
// Real auth is validated by the backend on every API call.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const PROTECTED_PATHS = ['/dashboard', '/profile', '/watchlist'];
const AUTH_PAGES = ['/login', '/signup'];

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has('logged_in');

  // 1. Resolve locale first using intlMiddleware
  const response = intlMiddleware(request);

  // Helper to check paths across all locales or just as-is
  const isPath = (paths: string[], currentPath: string) => {
    // Current path might be /en/login or just /login
    const pathWithoutLocale = currentPath.replace(/^\/(en|tr)(\/|$)/, '/');
    return paths.some((p) => pathWithoutLocale.startsWith(p) || pathWithoutLocale === p);
  };

  const localeMatch = pathname.match(/^\/(en|tr)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(/^\/(en|tr)(\/|$)/, '/');

  // 2. Apply Custom Redirection Logic (Auth)
  
  // ROOT → redirect logged-in users to market overview
  if (pathWithoutLocale === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/market-overview`, request.url));
    }
    return response;
  }

  // PROTECTED routes → redirect unauthenticated to login
  if (isPath(PROTECTED_PATHS, pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // AUTH pages → redirect already-logged-in users away
  if (isPath(AUTH_PAGES, pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/market-overview`, request.url));
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(tr|en)/:path*', '/dashboard/:path*', '/profile/:path*', '/watchlist/:path*', '/login', '/signup'],
};
