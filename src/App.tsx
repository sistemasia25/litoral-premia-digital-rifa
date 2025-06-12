
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { RaffleProvider } from "@/contexts/RaffleContext";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import Index from "./pages/Index";
import LoginParceiro from "./pages/LoginParceiro";
import Parceiro from "./pages/Parceiro";
import MeusNumeros from "./pages/MeusNumeros";
import { DoorToDoorDashboard } from "./pages/DoorToDoorDashboard";
import NotFound from "./pages/NotFound";

// Import admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import GerenciarSorteio from "./pages/admin/GerenciarSorteio";
import GerenciarPremiacoes from "./pages/admin/GerenciarPremiacoes";
import Sorteios from "./pages/admin/Sorteios";
import Parceiros from "./pages/admin/Parceiros";
import Financeiro from "./pages/admin/Financeiro";

// Partner pages
import PartnerDashboard from "./pages/parceiro/Dashboard";
import PartnerIndex from "./pages/parceiro/index";
import PartnerVendas from "./pages/parceiro/vendas/index";
import PartnerCliques from "./pages/parceiro/cliques/index";
import PartnerDesempenho from "./pages/parceiro/desempenho/index";
import PartnerSaques from "./pages/parceiro/saques/index";
import PartnerPerfil from "./pages/parceiro/perfil/index";
import PartnerConfiguracoes from "./pages/parceiro/configuracoes/index";

// Other pages
import CadastroParceiro from "./pages/cadastro-parceiro";
import Entrar from "./pages/entrar";
import GerenciarSorteioPage from "./pages/gerenciar-sorteio";
import AffiliateRoute from "./pages/r/[slug]";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecurityProvider>
            <AuthProvider>
              <AdminAuthProvider>
                <RaffleProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/entrar" element={<Entrar />} />
                    <Route path="/cadastro-parceiro" element={<CadastroParceiro />} />
                    <Route path="/meus-numeros" element={<MeusNumeros />} />
                    <Route path="/r/:slug" element={<AffiliateRoute />} />
                    
                    {/* Partner auth routes */}
                    <Route path="/login-parceiro" element={<LoginParceiro />} />
                    
                    {/* Protected partner routes */}
                    <Route 
                      path="/parceiro" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <Parceiro />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/door-to-door" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <DoorToDoorDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* New partner dashboard routes */}
                    <Route 
                      path="/parceiro/dashboard" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/home" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerIndex />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/vendas" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerVendas />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/cliques" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerCliques />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/desempenho" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerDesempenho />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/saques" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerSaques />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/perfil" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerPerfil />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parceiro/configuracoes" 
                      element={
                        <ProtectedRoute requiredRole="partner">
                          <PartnerConfiguracoes />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/gerenciar-sorteio" 
                      element={
                        <AdminProtectedRoute>
                          <GerenciarSorteio />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/gerenciar-premiacoes" 
                      element={
                        <AdminProtectedRoute>
                          <GerenciarPremiacoes />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/sorteios" 
                      element={
                        <AdminProtectedRoute>
                          <Sorteios />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/parceiros" 
                      element={
                        <AdminProtectedRoute>
                          <Parceiros />
                        </AdminProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/financeiro" 
                      element={
                        <AdminProtectedRoute>
                          <Financeiro />
                        </AdminProtectedRoute>
                      } 
                    />
                    
                    {/* Legacy admin route */}
                    <Route 
                      path="/gerenciar-sorteio" 
                      element={
                        <AdminProtectedRoute>
                          <GerenciarSorteioPage />
                        </AdminProtectedRoute>
                      } 
                    />
                    
                    {/* Redirects */}
                    <Route path="/admin/login" element={<Navigate to="/admin/login" replace />} />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RaffleProvider>
              </AdminAuthProvider>
            </AuthProvider>
          </SecurityProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
