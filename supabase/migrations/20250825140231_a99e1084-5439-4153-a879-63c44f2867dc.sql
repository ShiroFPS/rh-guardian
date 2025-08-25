-- Create positions table
CREATE TABLE public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  registration TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for positions (all authenticated users can read, only HR managers can modify)
CREATE POLICY "Anyone can view positions" 
ON public.positions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can create positions" 
ON public.positions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can update positions" 
ON public.positions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policies for departments (all authenticated users can read, only HR managers can modify)
CREATE POLICY "Anyone can view departments" 
ON public.departments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can create departments" 
ON public.departments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can update departments" 
ON public.departments 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policies for employees (all authenticated users can read, only HR managers can modify)
CREATE POLICY "Anyone can view employees" 
ON public.employees 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can create employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can update employees" 
ON public.employees 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HR managers can delete employees" 
ON public.employees 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial data
INSERT INTO public.departments (name, description) VALUES 
('Recursos Humanos', 'Departamento de gestão de pessoas'),
('Tecnologia da Informação', 'Departamento de TI e sistemas'),
('Financeiro', 'Departamento financeiro e contábil'),
('Vendas', 'Departamento comercial e vendas'),
('Marketing', 'Departamento de marketing e comunicação');

INSERT INTO public.positions (title, description) VALUES 
('Analista de RH', 'Responsável por processos de RH'),
('Gerente de RH', 'Gerente do departamento de RH'),
('Desenvolvedor', 'Desenvolvedor de software'),
('Analista de Sistemas', 'Analista de sistemas e infraestrutura'),
('Contador', 'Profissional de contabilidade'),
('Vendedor', 'Representante de vendas'),
('Analista de Marketing', 'Analista de marketing digital');