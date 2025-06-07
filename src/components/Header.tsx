
import { Home, Shield, Users, LogIn, UserPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-black border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/56e53f5a-394f-4d5c-add8-3c27c7e9ebc7.png" 
            alt="Litoral Premia" 
            className="w-12 h-12"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
            <Home className="w-4 h-4 mr-2" />
            Início
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
            <Shield className="w-4 h-4 mr-2" />
            Painel Admin
          </Button>
          
          {/* Área de Parceiros */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
              <LogIn className="w-4 h-4 mr-2" />
              Login Parceiro
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastro Parceiro
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
              <Eye className="w-4 h-4 mr-2" />
              Acesso Demo
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
