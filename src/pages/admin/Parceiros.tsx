import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Ban, CheckCircle, Instagram, MessageCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PartnerDetailsModal } from "@/components/admin/PartnerDetailsModal";
import { DoorToDoorOrdersTable } from "@/components/admin/DoorToDoorOrdersTable";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  cpf: string;
  city: string;
  state: string;
  instagram?: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  totalSales: number;
  totalEarnings: number;
  conversionRate: number;
}

interface DoorToDoorOrder {
  id: string;
  partnerId: string;
  partnerName: string;
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  amount: number;
  quantity: number;
  status: 'pending' | 'received' | 'cancelled';
  createdAt: string;
  agentName: string;
}

export default function AdminParceiros() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [doorToDoorOrders, setDoorToDoorOrders] = useState<DoorToDoorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
    fetchDoorToDoorOrders();
  }, []);

  const fetchPartners = async () => {
    try {
      // Simulação de dados - aqui seria uma chamada real para a API
      const mockPartners: Partner[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          whatsapp: '(11) 99999-9999',
          cpf: '123.456.789-01',
          city: 'São Paulo',
          state: 'SP',
          instagram: '@joao_silva',
          slug: 'joao-silva',
          status: 'active',
          createdAt: '2024-01-15',
          totalSales: 150,
          totalEarnings: 1250.50,
          conversionRate: 3.2
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(21) 88888-8888',
          whatsapp: '(21) 88888-8888',
          cpf: '987.654.321-02',
          city: 'Rio de Janeiro',
          state: 'RJ',
          instagram: '@maria_santos',
          slug: 'maria-santos',
          status: 'active',
          createdAt: '2024-02-10',
          totalSales: 89,
          totalEarnings: 780.25,
          conversionRate: 2.8
        },
        {
          id: '3',
          name: 'Carlos Oliveira',
          email: 'carlos@email.com',
          phone: '(31) 77777-7777',
          whatsapp: '(31) 77777-7777',
          cpf: '456.789.123-03',
          city: 'Belo Horizonte',
          state: 'MG',
          slug: 'carlos-oliveira',
          status: 'suspended',
          createdAt: '2024-03-05',
          totalSales: 45,
          totalEarnings: 320.75,
          conversionRate: 1.5
        }
      ];
      setPartners(mockPartners);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      toast({
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDoorToDoorOrders = async () => {
    try {
      // Simulação de dados - aqui seria uma chamada real para a API
      const mockOrders: DoorToDoorOrder[] = [
        {
          id: '1',
          partnerId: '1',
          partnerName: 'João Silva',
          customerName: 'Carlos Oliveira',
          customerWhatsApp: '(11) 77777-7777',
          customerCity: 'São Paulo',
          amount: 199.99,
          quantity: 10,
          status: 'pending',
          createdAt: '2024-06-10T10:30:00Z',
          agentName: 'João Silva'
        },
        {
          id: '2',
          partnerId: '2',
          partnerName: 'Maria Santos',
          customerName: 'Ana Costa',
          customerWhatsApp: '(21) 66666-6666',
          customerCity: 'Rio de Janeiro',
          amount: 99.99,
          quantity: 5,
          status: 'pending',
          createdAt: '2024-06-10T14:20:00Z',
          agentName: 'Maria Santos'
        }
      ];
      setDoorToDoorOrders(mockOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos porta a porta:', error);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.cpf.includes(searchTerm)
  );

  const handleViewPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = async (partnerId: string, newStatus: 'active' | 'suspended') => {
    try {
      // Aqui seria uma chamada real para a API
      setPartners(prev => prev.map(partner => 
        partner.id === partnerId ? { ...partner, status: newStatus } : partner
      ));
      
      toast({
        title: "Status atualizado",
        description: `Parceiro ${newStatus === 'active' ? 'ativado' : 'suspenso'} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do parceiro.",
        variant: "destructive"
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Parceiros</h2>
        <p className="text-gray-400">Gerencie parceiros cadastrados e pedidos porta a porta</p>
      </div>

      <Tabs defaultValue="partners" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="partners" className="text-white data-[state=active]:bg-orange-600">
            Parceiros Cadastrados
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-orange-600">
            Pedidos Porta a Porta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lista de Parceiros</CardTitle>
              <CardDescription className="text-gray-400">
                Visualize e gerencie todos os parceiros cadastrados com seus dados completos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, cidade ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Parceiro</TableHead>
                    <TableHead className="text-gray-300">Contato</TableHead>
                    <TableHead className="text-gray-300">Localização</TableHead>
                    <TableHead className="text-gray-300">CPF</TableHead>
                    <TableHead className="text-gray-300">Link</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Performance</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id} className="border-slate-700">
                      <TableCell>
                        <div>
                          <div className="text-white font-medium">{partner.name}</div>
                          <div className="text-gray-300 text-sm">{partner.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-300 text-sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {partner.whatsapp}
                          </div>
                          {partner.instagram && (
                            <div className="flex items-center text-gray-300 text-sm">
                              <Instagram className="w-3 h-3 mr-1" />
                              {partner.instagram}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-3 h-3 mr-1" />
                          {partner.city}, {partner.state}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {partner.cpf}
                      </TableCell>
                      <TableCell>
                        <code className="bg-slate-700 text-orange-400 px-2 py-1 rounded text-xs">
                          /r/{partner.slug}
                        </code>
                      </TableCell>
                      <TableCell>{getStatusBadge(partner.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-gray-300 text-sm">{partner.totalSales} vendas</div>
                          <div className="text-green-400 text-sm">R$ {partner.totalEarnings.toFixed(2)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPartner(partner)}
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {partner.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(partner.id, 'suspended')}
                              className="border-red-600 text-red-400 hover:bg-red-900"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(partner.id, 'active')}
                              className="border-green-600 text-green-400 hover:bg-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <DoorToDoorOrdersTable 
            orders={doorToDoorOrders}
            onOrderUpdate={fetchDoorToDoorOrders}
          />
        </TabsContent>
      </Tabs>

      <PartnerDetailsModal
        partner={selectedPartner}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
}
