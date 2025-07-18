// src/lib/sessions.ts
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: {email: string, expiresAt: Date}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

export async function createSession(email: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  const session = await encrypt({ email, expiresAt })
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session') 
  cookieStore.delete('jwt') // Also clear JWT if needed
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) {
    return null
  }

  const payload = await decrypt(session)
  if (!payload) {
    return null
  }

  return payload as { email: string; expiresAt: Date }
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

// Check if we have a valid JWT (longer-lived auth token)
export async function hasValidJWT() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  return !!jwt
}