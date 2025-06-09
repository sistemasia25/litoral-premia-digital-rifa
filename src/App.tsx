
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
import { AdminProvider } from "./contexts/AdminContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSorteios from "./pages/admin/Sorteios";
import AdminInfluenciadores from "./pages/admin/Influenciadores";
import AdminFinanceiro from "./pages/admin/Financeiro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/parceiro" element={<Parceiro />} />
              
              {/* Rotas protegidas do parceiro */}
              <Route element={<ProtectedRoute />}>
                <Route path="/parceiro/dashboard" element={<ParceiroDashboard />} />
              </Route>
              
              <Route path="/meus-numeros" element={<MeusNumeros />} />
              
              {/* Rotas de admin */}
              <Route path="/admin" element={<AdminLayout><AdminLogin /></AdminLayout>} />
              
              {/* Rotas protegidas do admin */}
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/sorteios" element={<AdminLayout><AdminSorteios /></AdminLayout>} />
                <Route path="/admin/influenciadores" element={<AdminLayout><AdminInfluenciadores /></AdminLayout>} />
                <Route path="/admin/financeiro" element={<AdminLayout><AdminFinanceiro /></AdminLayout>} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
