import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './types'

// Server-side Supabase client
export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}