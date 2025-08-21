import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  LogOut, 
  FileText,
  UserCheck,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Dados mockados de funcionários
const mockEmployees = [
  {
    id: 1,
    name: "Maria Silva Santos",
    cpf: "123.456.789-00",
    registration: "RH001",
    position: "Gerente de Vendas",
    department: "Comercial",
    status: "Ativo",
    documentsCount: 8
  },
  {
    id: 2,
    name: "João Pedro Oliveira",
    cpf: "987.654.321-00", 
    registration: "RH002",
    position: "Desenvolvedor Senior",
    department: "Tecnologia",
    status: "Ativo",
    documentsCount: 5
  },
  {
    id: 3,
    name: "Ana Costa Lima",
    cpf: "456.789.123-00",
    registration: "RH003", 
    position: "Analista Financeiro",
    department: "Financeiro",
    status: "Férias",
    documentsCount: 12
  }
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("rh-docs-user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    const filtered = mockEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cpf.includes(searchTerm) ||
      employee.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem("rh-docs-user");
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">RH-DOCS</h1>
                <p className="text-xs text-muted-foreground">Sistema de Recursos Humanos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'admin' ? 'Chefe do RH' : 'Funcionário'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{mockEmployees.length}</p>
                  <p className="text-sm text-muted-foreground">Funcionários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-success" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">
                    {mockEmployees.filter(e => e.status === 'Ativo').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-warning" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">
                    {mockEmployees.filter(e => e.status === 'Férias').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Em Férias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-accent" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">
                    {mockEmployees.reduce((acc, emp) => acc + emp.documentsCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar funcionário (nome, CPF, matrícula...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {user.role === 'admin' && (
            <Button 
              onClick={() => navigate("/cadastro")}
              className="gap-2 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
            >
              <Plus className="w-4 h-4" />
              Novo Funcionário
            </Button>
          )}
        </div>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários Cadastrados</CardTitle>
            <CardDescription>
              {filteredEmployees.length} funcionário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div 
                  key={employee.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {employee.position} • {employee.department}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Matrícula: {employee.registration} • CPF: {employee.cpf}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={employee.status === 'Ativo' ? 'default' : 'secondary'}
                          className={employee.status === 'Ativo' ? 'bg-success hover:bg-success/80' : ''}
                        >
                          {employee.status}
                        </Badge>
                        <Badge variant="outline">
                          {employee.documentsCount} docs
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                    {user.role === 'admin' && (
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;