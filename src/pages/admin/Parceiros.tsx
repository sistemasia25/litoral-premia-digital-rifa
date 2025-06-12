
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Ban, CheckCircle, Instagram, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  cpf: string;
  city: string;
  state: string;
  instagram?: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

interface DoorToDoorOrder {
  id: string;
  partner_id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_city: string;
  total_amount: number;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
}

export default function AdminParceiros() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [doorToDoorOrders, setDoorToDoorOrders] = useState<DoorToDoorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
    fetchDoorToDoorOrders();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'partner')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
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
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          profiles!partner_id (
            first_name,
            last_name
          )
        `)
        .eq('is_door_to_door', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOrders = data?.map(order => ({
        id: order.id,
        partner_id: order.partner_id,
        customer_name: order.customer_name,
        customer_whatsapp: order.customer_whatsapp,
        customer_city: order.customer_city,
        total_amount: order.total_amount,
        quantity: order.quantity,
        status: order.status as 'pending' | 'completed' | 'cancelled' | 'refunded',
        created_at: order.created_at
      })) || [];

      setDoorToDoorOrders(formattedOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos porta a porta:', error);
    }
  };

  const filteredPartners = partners.filter(partner =>
    (partner.first_name + ' ' + partner.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.cpf?.includes(searchTerm)
  );

  const handleStatusChange = async (partnerId: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', partnerId);

      if (error) throw error;
      
      await fetchPartners();
      
      toast({
        title: "Status atualizado",
        description: `Parceiro ${newStatus ? 'ativado' : 'suspenso'} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do parceiro.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-600">Ativo</Badge>
    ) : (
      <Badge className="bg-red-600">Suspenso</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
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
            Parceiros Cadastrados ({partners.length})
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-white data-[state=active]:bg-orange-600">
            Pedidos Porta a Porta ({doorToDoorOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Lista de Parceiros</CardTitle>
              <CardDescription className="text-gray-400">
                {partners.length === 0 
                  ? "Nenhum parceiro cadastrado ainda. Os parceiros aparecerão aqui quando se cadastrarem."
                  : "Visualize e gerencie todos os parceiros cadastrados"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {partners.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email, cidade ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>
              )}

              {partners.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">Nenhum parceiro cadastrado ainda.</p>
                  <p className="text-sm text-gray-500">
                    Os parceiros aparecerão aqui quando se cadastrarem através da página de cadastro.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">Parceiro</TableHead>
                      <TableHead className="text-gray-300">Contato</TableHead>
                      <TableHead className="text-gray-300">Localização</TableHead>
                      <TableHead className="text-gray-300">CPF</TableHead>
                      <TableHead className="text-gray-300">Link</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <div className="text-white font-medium">
                              {partner.first_name} {partner.last_name}
                            </div>
                            <div className="text-gray-300 text-sm">{partner.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-300 text-sm">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {partner.whatsapp || 'Não informado'}
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
                            {partner.city && partner.state ? `${partner.city}, ${partner.state}` : 'Não informado'}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono text-sm">
                          {partner.cpf || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          {partner.slug ? (
                            <code className="bg-slate-700 text-orange-400 px-2 py-1 rounded text-xs">
                              /r/{partner.slug}
                            </code>
                          ) : (
                            <span className="text-gray-500 text-xs">Não definido</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(partner.is_active)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {partner.is_active ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(partner.id, false)}
                                className="border-red-600 text-red-400 hover:bg-red-900"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(partner.id, true)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Pedidos Porta a Porta</CardTitle>
              <CardDescription className="text-gray-400">
                {doorToDoorOrders.length === 0 
                  ? "Nenhum pedido porta a porta ainda."
                  : "Gerencie os pedidos realizados porta a porta"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {doorToDoorOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhum pedido porta a porta registrado ainda.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">Cliente</TableHead>
                      <TableHead className="text-gray-300">Parceiro</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Quantidade</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doorToDoorOrders.map((order) => (
                      <TableRow key={order.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <div className="text-white font-medium">{order.customer_name}</div>
                            <div className="text-gray-300 text-sm">{order.customer_whatsapp}</div>
                            <div className="text-gray-400 text-xs">{order.customer_city}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {/* Nome do parceiro seria buscado pela relação */}
                          Parceiro ID: {order.partner_id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-gray-300">
                          R$ {order.total_amount?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-300">{order.quantity}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-600' :
                            order.status === 'pending' ? 'bg-yellow-600' : 
                            order.status === 'refunded' ? 'bg-orange-600' : 'bg-red-600'
                          }>
                            {order.status === 'completed' ? 'Concluído' :
                             order.status === 'pending' ? 'Pendente' : 
                             order.status === 'refunded' ? 'Reembolsado' : 'Cancelado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
