
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Trophy, Play, Pause, Square } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tables } from '@/integrations/supabase/types';

type Sorteio = Tables<'sorteios'>;

export default function Sorteios() {
  const { adminUser } = useAdminAuth();
  const { toast } = useToast();
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSorteio, setEditingSorteio] = useState<Sorteio | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    banner_url: '',
    preco_por_numero: 5.00,
    quantidade_total_numeros: 1000,
    data_sorteio: '',
    premio_principal: '',
    premios_extras: '',
    status: 'ativo'
  });

  useEffect(() => {
    carregarSorteios();
  }, []);

  const carregarSorteios = async () => {
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
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      banner_url: '',
      preco_por_numero: 5.00,
      quantidade_total_numeros: 1000,
      data_sorteio: '',
      premio_principal: '',
      premios_extras: '',
      status: 'ativo'
    });
    setEditingSorteio(null);
  };

  const abrirFormulario = (sorteio?: Sorteio) => {
    if (sorteio) {
      setEditingSorteio(sorteio);
      setFormData({
        titulo: sorteio.titulo,
        descricao: sorteio.descricao || '',
        banner_url: sorteio.banner_url || '',
        preco_por_numero: Number(sorteio.preco_por_numero),
        quantidade_total_numeros: sorteio.quantidade_total_numeros,
        data_sorteio: new Date(sorteio.data_sorteio).toISOString().slice(0, 16),
        premio_principal: sorteio.premio_principal,
        premios_extras: JSON.stringify(sorteio.premios_extras),
        status: sorteio.status
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const salvarSorteio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dadosSorteio = {
        titulo: formData.titulo,
        descricao: formData.descricao || null,
        banner_url: formData.banner_url || null,
        preco_por_numero: formData.preco_por_numero,
        quantidade_total_numeros: formData.quantidade_total_numeros,
        data_sorteio: formData.data_sorteio,
        premio_principal: formData.premio_principal,
        premios_extras: formData.premios_extras ? JSON.parse(formData.premios_extras) : [],
        status: formData.status
      };

      if (editingSorteio) {
        const { error } = await supabase
          .from('sorteios')
          .update(dadosSorteio)
          .eq('id', editingSorteio.id);

        if (error) throw error;

        toast({
          title: "Sorteio atualizado",
          description: "Sorteio atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('sorteios')
          .insert([dadosSorteio]);

        if (error) throw error;

        toast({
          title: "Sorteio criado",
          description: "Novo sorteio criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      carregarSorteios();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar sorteio",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const alterarStatusSorteio = async (id: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('sorteios')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status alterado",
        description: `Sorteio ${novoStatus === 'ativo' ? 'ativado' : novoStatus === 'pausado' ? 'pausado' : 'finalizado'} com sucesso!`,
      });

      carregarSorteios();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const excluirSorteio = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sorteio?')) return;

    try {
      const { error } = await supabase
        .from('sorteios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sorteio excluído",
        description: "Sorteio excluído com sucesso!",
      });

      carregarSorteios();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir sorteio",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: 'Ativo', variant: 'default' as const },
      pausado: { label: 'Pausado', variant: 'secondary' as const },
      finalizado: { label: 'Finalizado', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Sorteios</h1>
          <p className="text-slate-400">Crie e gerencie seus sorteios</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirFormulario()} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" />
              Novo Sorteio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSorteio ? 'Editar Sorteio' : 'Criar Novo Sorteio'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={salvarSorteio} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-slate-300">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-slate-300">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner_url" className="text-slate-300">URL do Banner</Label>
                <Input
                  id="banner_url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, banner_url: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="/caminho/para/banner.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco_por_numero" className="text-slate-300">Preço por Número (R$)</Label>
                  <Input
                    id="preco_por_numero"
                    type="number"
                    step="0.01"
                    value={formData.preco_por_numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco_por_numero: parseFloat(e.target.value) }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidade_total_numeros" className="text-slate-300">Total de Números</Label>
                  <Input
                    id="quantidade_total_numeros"
                    type="number"
                    value={formData.quantidade_total_numeros}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantidade_total_numeros: parseInt(e.target.value) }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_sorteio" className="text-slate-300">Data do Sorteio</Label>
                  <Input
                    id="data_sorteio"
                    type="datetime-local"
                    value={formData.data_sorteio}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_sorteio: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="premio_principal" className="text-slate-300">Prêmio Principal</Label>
                  <Input
                    id="premio_principal"
                    value={formData.premio_principal}
                    onChange={(e) => setFormData(prev => ({ ...prev, premio_principal: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premios_extras" className="text-slate-300">Prêmios Extras (JSON)</Label>
                <Textarea
                  id="premios_extras"
                  value={formData.premios_extras}
                  onChange={(e) => setFormData(prev => ({ ...prev, premios_extras: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder='[{"descricao": "30x R$100", "quantidade": 30, "valor": 100}]'
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editingSorteio ? 'Atualizar' : 'Criar'} Sorteio
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Sorteios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Título</TableHead>
                <TableHead className="text-slate-300">Prêmio Principal</TableHead>
                <TableHead className="text-slate-300">Preço</TableHead>
                <TableHead className="text-slate-300">Números</TableHead>
                <TableHead className="text-slate-300">Data Sorteio</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorteios.map((sorteio) => (
                <TableRow key={sorteio.id}>
                  <TableCell className="text-white font-medium">{sorteio.titulo}</TableCell>
                  <TableCell className="text-slate-300">{sorteio.premio_principal}</TableCell>
                  <TableCell className="text-slate-300">R$ {Number(sorteio.preco_por_numero).toFixed(2)}</TableCell>
                  <TableCell className="text-slate-300">
                    {sorteio.numeros_vendidos}/{sorteio.quantidade_total_numeros}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(sorteio.data_sorteio).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(sorteio.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirFormulario(sorteio)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {sorteio.status === 'ativo' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alterarStatusSorteio(sorteio.id, 'pausado')}
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {sorteio.status === 'pausado' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alterarStatusSorteio(sorteio.id, 'ativo')}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(sorteio.status === 'ativo' || sorteio.status === 'pausado') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alterarStatusSorteio(sorteio.id, 'finalizado')}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => excluirSorteio(sorteio.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
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
}
