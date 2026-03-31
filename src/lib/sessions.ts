// src/lib/sessions.ts
// Simple cookie-based session flag for middleware redirects.
// The REAL auth is the backend's HttpOnly refresh token cookie.
// This cookie is just a lightweight hint so middleware knows to redirect.
'use server'

import { cookies } from 'next/headers'

const SESSION_COOKIE = 'logged_in'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

/**
 * Sets a simple flag cookie indicating the user is logged in.
 * This is NOT a security mechanism — just a redirect hint for middleware.
 */
export async function setSessionFlag(email: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Clears the session flag cookie on logout.
 */
export async function clearSessionFlag() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Reads the session flag cookie value (email or null).
 */
export async function getSessionFlag(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}
