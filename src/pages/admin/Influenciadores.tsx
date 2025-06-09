
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

type Parceiro = {
  id: string;
  nome: string;
  whatsapp: string;
  codigo_referencia: string;
  saldo_disponivel: number;
  created_at: string;
  user_id: string;
};

const AdminInfluenciadores = () => {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingParceiro, setViewingParceiro] = useState<Parceiro | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchParceiros();
  }, []);

  const fetchParceiros = async () => {
    try {
      const { data, error } = await supabase
        .from('parceiros')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParceiros(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar influenciadores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSaldo = async (parceiroId: string, novoSaldo: number) => {
    try {
      const { error } = await supabase
        .from('parceiros')
        .update({ saldo_disponivel: novoSaldo })
        .eq('id', parceiroId);

      if (error) throw error;
      toast({ title: "Saldo atualizado com sucesso!" });
      fetchParceiros();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar saldo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este influenciador?')) return;

    try {
      const { error } = await supabase
        .from('parceiros')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Influenciador excluído com sucesso!" });
      fetchParceiros();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir influenciador",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Influenciadores</h2>
          <p className="text-gray-400">Gerencie parceiros e suas comissões</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Lista de Influenciadores</CardTitle>
          <CardDescription className="text-gray-400">
            Visualize e gerencie todos os influenciadores cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">WhatsApp</TableHead>
                <TableHead className="text-gray-300">Código</TableHead>
                <TableHead className="text-gray-300">Saldo</TableHead>
                <TableHead className="text-gray-300">Cadastro</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parceiros.map((parceiro) => (
                <TableRow key={parceiro.id} className="border-gray-800">
                  <TableCell className="text-white">{parceiro.nome}</TableCell>
                  <TableCell className="text-white">{parceiro.whatsapp}</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-600">{parceiro.codigo_referencia}</Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    R$ {parceiro.saldo_disponivel?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-white">
                    {new Date(parceiro.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingParceiro(parceiro)}
                            className="border-gray-600 text-white hover:bg-gray-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800">
                          <DialogHeader>
                            <DialogTitle className="text-white">Detalhes do Influenciador</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Informações e gestão de saldo
                            </DialogDescription>
                          </DialogHeader>
                          {viewingParceiro && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white">Nome</Label>
                                  <p className="text-gray-300">{viewingParceiro.nome}</p>
                                </div>
                                <div>
                                  <Label className="text-white">WhatsApp</Label>
                                  <p className="text-gray-300">{viewingParceiro.whatsapp}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white">Código de Referência</Label>
                                  <p className="text-gray-300">{viewingParceiro.codigo_referencia}</p>
                                </div>
                                <div>
                                  <Label className="text-white">Saldo Atual</Label>
                                  <p className="text-gray-300">R$ {viewingParceiro.saldo_disponivel?.toFixed(2) || '0.00'}</p>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="novoSaldo" className="text-white">Atualizar Saldo</Label>
                                <div className="flex space-x-2 mt-2">
                                  <Input
                                    id="novoSaldo"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        const target = e.target as HTMLInputElement;
                                        handleUpdateSaldo(viewingParceiro.id, parseFloat(target.value));
                                        target.value = '';
                                      }
                                    }}
                                  />
                                  <Button 
                                    onClick={(e) => {
                                      const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                      if (input?.value) {
                                        handleUpdateSaldo(viewingParceiro.id, parseFloat(input.value));
                                        input.value = '';
                                      }
                                    }}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Atualizar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(parceiro.id)}
                        className="border-red-600 text-red-400 hover:bg-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInfluenciadores;
