// src/lib/auth-actions.ts
'use server'

import { setSessionFlag, clearSessionFlag } from './sessions'
import { revalidatePath } from 'next/cache'

export async function createSessionAction(email: string) {
  await setSessionFlag(email)
  revalidatePath('/', 'layout')
}

export async function deleteSessionAction() {
  await clearSessionFlag()
  revalidatePath('/', 'layout')
}