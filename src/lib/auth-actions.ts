// src/lib/auth-actions.ts
'use server'

import { createSession, deleteSession, getSession, hasValidJWT } from './sessions'
import { authClient } from './auth-client'
import { cookies } from 'next/headers'

export async function refreshSessionAction() {
  try {
    // Check if we have a valid JWT
    if (!await hasValidJWT()) {
      return { success: false, error: 'No valid JWT' }
    }

    // Get the JWT token to pass to getCurrentUser
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return { success: false, error: 'No JWT token' }
    }

    // Call /me with the JWT token
    const user = await authClient.getCurrentUser(jwt)
    
    // Create a new session
    await createSession(user.email)
    
    return { success: true, user }
  } catch (error) {
    console.error('Failed to refresh session:', error)
    // If /me fails, clear the session
    await deleteSession()
    return { success: false, error: 'Failed to refresh session' }
  }
}

export async function createSessionAction(email: string) {
  try {
    await createSession(email)
    return { success: true }
  } catch (error) {
    console.error('Failed to create session:', error)
    return { success: false, error: 'Failed to create session' }
  }
}

export async function deleteSessionAction() {
  try {
    await deleteSession()
    return { success: true }
  } catch (error) {
    console.error('Failed to delete session:', error)
    return { success: false, error: 'Failed to delete session' }
  }
}

export async function getSessionAction() {
  try {
    const session = await getSession()
    return { success: true, session }
  } catch (error) {
    console.error('Failed to get session:', error)
    return { success: false, error: 'Failed to get session' }
  }
}