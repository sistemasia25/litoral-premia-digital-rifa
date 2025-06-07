
import { Flame, Home, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-black border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-orange-primary" />
          <span className="text-xl font-bold text-white">Litoral da Sorte</span>
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
          <Button variant="ghost" className="text-gray-300 hover:text-orange-primary">
            <Users className="w-4 h-4 mr-2" />
            Parceiros
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
