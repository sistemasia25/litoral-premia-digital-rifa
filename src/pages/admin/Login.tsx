import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Login do Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-400">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white" 
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-400">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white" 
              required
            />
          </div>
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
