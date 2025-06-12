
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function GerenciarSorteio() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [raffleData, setRaffleData] = useState({
    title: '',
    description: '',
    total_numbers: 10000,
    price_per_number: 1.99,
    discount_price: 0.99,
    discount_min_quantity: 10,
    commission_rate: 30.00,
    draw_date: '',
    image_url: '',
    rules: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadActiveRaffle();
  }, []);

  const loadActiveRaffle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setRaffleData({
          title: data.title || '',
          description: data.description || '',
          total_numbers: data.total_numbers || 10000,
          price_per_number: data.price_per_number || 1.99,
          discount_price: data.discount_price || 0.99,
          discount_min_quantity: data.discount_min_quantity || 10,
          commission_rate: data.commission_rate || 30.00,
          draw_date: data.draw_date ? data.draw_date.split('T')[0] : '',
          image_url: data.image_url || '',
          rules: data.rules || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar sorteio:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do sorteio.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!raffleData.title.trim()) {
      toast({
        title: 'Erro',
        description: 'O título do sorteio é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Verificar se existe um sorteio ativo
      const { data: existingRaffle } = await supabase
        .from('raffles')
        .select('id')
        .eq('status', 'active')
        .maybeSingle();

      const rafflePayload = {
        ...raffleData,
        draw_date: raffleData.draw_date ? new Date(raffleData.draw_date).toISOString() : null,
        status: 'active' as const
      };

      if (existingRaffle) {
        // Atualizar sorteio existente
        const { error } = await supabase
          .from('raffles')
          .update(rafflePayload)
          .eq('id', existingRaffle.id);

        if (error) throw error;
      } else {
        // Criar novo sorteio
        const { error } = await supabase
          .from('raffles')
          .insert([rafflePayload]);

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Sorteio salvo com sucesso!',
      });

      // Recarregar dados
      await loadActiveRaffle();
    } catch (error) {
      console.error('Erro ao salvar sorteio:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o sorteio.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gerenciar Sorteio</h1>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Informações do Sorteio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Título</Label>
              <Input
                id="title"
                value={raffleData.title}
                onChange={(e) => setRaffleData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Ex: Sorteio de Fim de Ano 2025"
              />
            </div>
            <div>
              <Label htmlFor="draw_date" className="text-gray-300">Data do Sorteio</Label>
              <Input
                id="draw_date"
                type="date"
                value={raffleData.draw_date}
                onChange={(e) => setRaffleData(prev => ({ ...prev, draw_date: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Descrição</Label>
            <Textarea
              id="description"
              value={raffleData.description}
              onChange={(e) => setRaffleData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
              placeholder="Descreva o sorteio..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_numbers" className="text-gray-300">Total de Números</Label>
              <Input
                id="total_numbers"
                type="number"
                value={raffleData.total_numbers}
                onChange={(e) => setRaffleData(prev => ({ ...prev, total_numbers: parseInt(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="price_per_number" className="text-gray-300">Preço por Número (R$)</Label>
              <Input
                id="price_per_number"
                type="number"
                step="0.01"
                value={raffleData.price_per_number}
                onChange={(e) => setRaffleData(prev => ({ ...prev, price_per_number: parseFloat(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="commission_rate" className="text-gray-300">Taxa de Comissão (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={raffleData.commission_rate}
                onChange={(e) => setRaffleData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_price" className="text-gray-300">Preço com Desconto (R$)</Label>
              <Input
                id="discount_price"
                type="number"
                step="0.01"
                value={raffleData.discount_price}
                onChange={(e) => setRaffleData(prev => ({ ...prev, discount_price: parseFloat(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="discount_min_quantity" className="text-gray-300">Qtd. Mín. para Desconto</Label>
              <Input
                id="discount_min_quantity"
                type="number"
                value={raffleData.discount_min_quantity}
                onChange={(e) => setRaffleData(prev => ({ ...prev, discount_min_quantity: parseInt(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              value={raffleData.image_url}
              onChange={(url) => setRaffleData(prev => ({ ...prev, image_url: url }))}
              label="Banner do Sorteio"
              placeholder="URL da imagem ou faça upload do banner"
            />
          </div>

          <div>
            <Label htmlFor="rules" className="text-gray-300">Regulamento</Label>
            <Textarea
              id="rules"
              value={raffleData.rules}
              onChange={(e) => setRaffleData(prev => ({ ...prev, rules: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              rows={4}
              placeholder="Digite o regulamento do sorteio..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
