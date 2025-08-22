import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Employee, Position, Department } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name')

      if (error) throw error
      setEmployees(data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar funcionários",
        description: error.message
      })
    }
  }

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('title')

      if (error) throw error
      setPositions(data || [])
    } catch (error: any) {
      console.error('Error fetching positions:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (error: any) {
      console.error('Error fetching departments:', error)
    }
  }

  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Funcionário cadastrado",
        description: `${employeeData.name} foi cadastrado com sucesso`
      })

      await fetchEmployees()
      return { data, error: null }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar funcionário",
        description: error.message
      })
      return { data: null, error }
    }
  }

  const searchEmployees = (searchTerm: string) => {
    if (!searchTerm.trim()) return employees

    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cpf.includes(searchTerm) ||
      employee.registration.includes(searchTerm) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchEmployees(),
        fetchPositions(),
        fetchDepartments()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  return {
    employees,
    positions,
    departments,
    loading,
    createEmployee,
    searchEmployees,
    refreshEmployees: fetchEmployees
  }
}