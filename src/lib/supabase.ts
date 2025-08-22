import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yabldejwifckbuutyppe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhYmxkZWp3aWZja2J1dXR5cHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTIxMjUsImV4cCI6MjA3MTM2ODEyNX0.Lm2CCVew6qD4TGBVDHlC7G9y1cClOJ1NAwOeEZVZhUk'

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