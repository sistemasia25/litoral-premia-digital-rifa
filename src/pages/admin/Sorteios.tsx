
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

type Sorteio = {
  id: string;
  titulo: string;
  descricao: string;
  premio_principal: string;
  premios_extras: any[];
  preco_por_numero: number;
  quantidade_numeros: number;
  data_sorteio: string;
  banner_url: string;
  status: string;
  numeros_vendidos: number;
  created_at: string;
};

const AdminSorteios = () => {
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSorteio, setEditingSorteio] = useState<Sorteio | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    premio_principal: '',
    premios_extras: '',
    preco_por_numero: '',
    quantidade_numeros: '',
    data_sorteio: '',
    banner_url: '',
  });

  useEffect(() => {
    fetchSorteios();
  }, []);

  const fetchSorteios = async () => {
    try {
      const { data, error } = await supabase
        .from('sorteios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSorteios(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar sorteios",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sorteioData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        premio_principal: formData.premio_principal,
        premios_extras: formData.premios_extras ? JSON.parse(formData.premios_extras) : [],
        preco_por_numero: parseFloat(formData.preco_por_numero),
        quantidade_numeros: parseInt(formData.quantidade_numeros),
        data_sorteio: formData.data_sorteio,
        banner_url: formData.banner_url,
        status: 'ativo',
        numeros_vendidos: 0,
      };

      if (editingSorteio) {
        const { error } = await supabase
          .from('sorteios')
          .update(sorteioData)
          .eq('id', editingSorteio.id);

        if (error) throw error;
        toast({ title: "Sorteio atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('sorteios')
          .insert([sorteioData]);

        if (error) throw error;
        toast({ title: "Sorteio criado com sucesso!" });
      }

      setDialogOpen(false);
      setEditingSorteio(null);
      setFormData({
        titulo: '', descricao: '', premio_principal: '', premios_extras: '',
        preco_por_numero: '', quantidade_numeros: '', data_sorteio: '', banner_url: ''
      });
      fetchSorteios();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar sorteio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sorteio: Sorteio) => {
    setEditingSorteio(sorteio);
    setFormData({
      titulo: sorteio.titulo,
      descricao: sorteio.descricao,
      premio_principal: sorteio.premio_principal,
      premios_extras: JSON.stringify(sorteio.premios_extras),
      preco_por_numero: sorteio.preco_por_numero.toString(),
      quantidade_numeros: sorteio.quantidade_numeros.toString(),
      data_sorteio: sorteio.data_sorteio,
      banner_url: sorteio.banner_url,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sorteio?')) return;

    try {
      const { error } = await supabase
        .from('sorteios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sorteio excluído com sucesso!" });
      fetchSorteios();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir sorteio",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Sorteios</h2>
          <p className="text-gray-400">Crie e gerencie seus sorteios</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Sorteio
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSorteio ? 'Editar Sorteio' : 'Novo Sorteio'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha os dados do sorteio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-white">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premio_principal" className="text-white">Prêmio Principal</Label>
                  <Input
                    id="premio_principal"
                    value={formData.premio_principal}
                    onChange={(e) => setFormData({...formData, premio_principal: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-white">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco_por_numero" className="text-white">Preço por Número (R$)</Label>
                  <Input
                    id="preco_por_numero"
                    type="number"
                    step="0.01"
                    value={formData.preco_por_numero}
                    onChange={(e) => setFormData({...formData, preco_por_numero: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade_numeros" className="text-white">Quantidade de Números</Label>
                  <Input
                    id="quantidade_numeros"
                    type="number"
                    value={formData.quantidade_numeros}
                    onChange={(e) => setFormData({...formData, quantidade_numeros: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_sorteio" className="text-white">Data do Sorteio</Label>
                  <Input
                    id="data_sorteio"
                    type="date"
                    value={formData.data_sorteio}
                    onChange={(e) => setFormData({...formData, data_sorteio: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner_url" className="text-white">URL do Banner</Label>
                <Input
                  id="banner_url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({...formData, banner_url: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://exemplo.com/banner.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="premios_extras" className="text-white">Prêmios Extras (JSON)</Label>
                <Textarea
                  id="premios_extras"
                  value={formData.premios_extras}
                  onChange={(e) => setFormData({...formData, premios_extras: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder='["30x R$100", "10x R$50"]'
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Lista de Sorteios</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie todos os sorteios do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Título</TableHead>
                <TableHead className="text-gray-300">Prêmio</TableHead>
                <TableHead className="text-gray-300">Preço</TableHead>
                <TableHead className="text-gray-300">Data</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Vendidos</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorteios.map((sorteio) => (
                <TableRow key={sorteio.id} className="border-gray-800">
                  <TableCell className="text-white">{sorteio.titulo}</TableCell>
                  <TableCell className="text-white">{sorteio.premio_principal}</TableCell>
                  <TableCell className="text-white">R$ {sorteio.preco_por_numero}</TableCell>
                  <TableCell className="text-white">
                    {new Date(sorteio.data_sorteio).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={sorteio.status === 'ativo' ? 'default' : 'secondary'}
                      className={sorteio.status === 'ativo' ? 'bg-green-600' : 'bg-gray-600'}
                    >
                      {sorteio.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    {sorteio.numeros_vendidos} / {sorteio.quantidade_numeros}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(sorteio)}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(sorteio.id)}
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

export default AdminSorteios;
