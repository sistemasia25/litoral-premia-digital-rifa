
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Parceiro from "./pages/Parceiro";
import ParceiroDashboard from "./pages/parceiro/Dashboard";
import MeusNumeros from "./pages/MeusNumeros";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import { AdminLayout } from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Sorteios from "./pages/admin/Sorteios";
import AdminParceiros from "./pages/admin/Parceiros";
import AdminFinanceiro from "./pages/admin/Financeiro";
import GerenciarSorteio from "./pages/admin/GerenciarSorteio";
import GerenciarPremiacoes from "./pages/admin/GerenciarPremiacoes";
import { RaffleProvider } from "./contexts/RaffleContext";
import { DoorToDoorDashboard } from "./pages/DoorToDoorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <RaffleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/parceiro" element={<Parceiro />} />
                
                {/* Rotas protegidas do parceiro */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/parceiro/dashboard" element={<ParceiroDashboard />} />
                  <Route path="/parceiro/porta-a-porta" element={<DoorToDoorDashboard />} />
                </Route>
                
                <Route path="/meus-numeros" element={<MeusNumeros />} />
                
                {/* Rotas do admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="sorteios" element={<Sorteios />} />
                    <Route path="parceiros" element={<AdminParceiros />} />
                    <Route path="financeiro" element={<AdminFinanceiro />} />
                    <Route path="sorteios/gerenciar" element={<GerenciarSorteio />} />
                    <Route path="premiacoes" element={<GerenciarPremiacoes />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RaffleProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
