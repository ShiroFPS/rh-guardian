-- Criar tabelas para o sistema RH-DOCS

-- Tabela de departamentos
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cargos
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  registration VARCHAR(20) NOT NULL UNIQUE,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO departments (name, description) VALUES
  ('Recursos Humanos', 'Gestão de pessoas e processos de RH'),
  ('Tecnologia da Informação', 'Desenvolvimento e manutenção de sistemas'),
  ('Financeiro', 'Gestão financeira e contábil'),
  ('Comercial', 'Vendas e relacionamento com clientes'),
  ('Operações', 'Processos operacionais e logística')
ON CONFLICT (name) DO NOTHING;

INSERT INTO positions (title, description) VALUES
  ('Gerente de RH', 'Responsável pela gestão da equipe de RH'),
  ('Analista de RH', 'Execução de processos de recursos humanos'),
  ('Desenvolvedor Full Stack', 'Desenvolvimento de aplicações web'),
  ('Analista de Sistemas', 'Análise e modelagem de sistemas'),
  ('Contador', 'Responsável pela contabilidade da empresa'),
  ('Vendedor', 'Execução de vendas e atendimento'),
  ('Analista Comercial', 'Análise de processos comerciais'),
  ('Operador', 'Execução de processos operacionais')
ON CONFLICT (title) DO NOTHING;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Allow read access for authenticated users" ON employees
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON positions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access for authenticated users" ON departments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserção apenas para gerentes de RH
CREATE POLICY "Allow insert for HR managers only" ON employees
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'hr_manager');

-- Política para permitir atualização apenas para gerentes de RH
CREATE POLICY "Allow update for HR managers only" ON employees
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'hr_manager');

-- Permitir inserção/atualização em positions e departments para gerentes de RH
CREATE POLICY "Allow insert for HR managers only" ON positions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'hr_manager');

CREATE POLICY "Allow insert for HR managers only" ON departments
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'hr_manager');