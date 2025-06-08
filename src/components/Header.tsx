
import { Ticket, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  console.log("Header component rendering");
  
  return (
    <header className="bg-black border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/56e53f5a-394f-4d5c-add8-3c27c7e9ebc7.png" 
            alt="Litoral Premia" 
            className="w-12 h-12"
          />
        </Link>
        
        <nav className="flex items-center space-x-2">
          <Button 
            asChild
            variant="ghost" 
            className="text-gray-300 hover:text-orange-primary hover:bg-orange-500/10 px-3 py-1 text-sm"
          >
            <Link to="/meus-numeros">
              <Ticket className="w-4 h-4 mr-2" />
              Meus Números
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="ghost" 
            className="text-gray-300 hover:text-orange-primary hover:bg-orange-500/10 px-3 py-1 text-sm"
          >
            <Link to="/parceiro">
              <Users className="w-4 h-4 mr-2" />
              Parceiros
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="ghost" 
            className="text-gray-300 hover:text-orange-primary hover:bg-orange-500/10 px-3 py-1 text-sm"
          >
            <Link to="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
