
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, MapPin, Phone, TrendingUp, DollarSign } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  totalSales: number;
  totalEarnings: number;
  conversionRate: number;
}

interface PartnerDetailsModalProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnerDetailsModal({ partner, open, onOpenChange }: PartnerDetailsModalProps) {
  if (!partner) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-600">Suspenso</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-600">Inativo</Badge>;
      default:
        return <Badge className="bg-gray-600">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Detalhes do Parceiro</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {partner.name}
                {getStatusBadge(partner.status)}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>{partner.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.city}, {partner.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Cadastrado em {formatDate(partner.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Performance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance</CardTitle>
              <CardDescription className="text-gray-400">
                Estatísticas de vendas e desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Total de Vendas</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{partner.totalSales}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-400">Total Ganhos</span>
                  </div>
                  <p className="text-2xl font-bold text-white">R$ {partner.totalEarnings.toFixed(2)}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <span className="text-sm text-gray-400">Taxa de Conversão</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{partner.conversionRate}%</p>
                </div>
              </div>

              <Separator className="my-4 bg-slate-700" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Média por venda:</span>
                  <span className="text-white ml-2">
                    R$ {partner.totalSales > 0 ? (partner.totalEarnings / partner.totalSales).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Status da conta:</span>
                  <span className="text-white ml-2">
                    {partner.status === 'active' ? 'Ativo e funcionando' : 
                     partner.status === 'suspended' ? 'Conta suspensa' : 'Inativo'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
