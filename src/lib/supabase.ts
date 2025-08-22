import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Employee {
  id: string
  name: string
  cpf: string
  registration: string
  position: string
  department: string
  hire_date: string
  status: 'active' | 'inactive'
  documents: string[]
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  title: string
  description?: string
  created_at: string
}

export interface Department {
  id: string
  name: string
  description?: string
  created_at: string
}