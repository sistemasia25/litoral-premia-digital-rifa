
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone, Instagram, CreditCard } from 'lucide-react';

interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  instagram: string;
  pix_key: string;
  is_active: boolean;
  created_at: string;
  slug: string;
}

export function SimplifiedPartnersTable() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPartners = async () => {
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
        title: 'Erro',
        description: 'Não foi possível carregar os parceiros.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const togglePartnerStatus = async (partnerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', partnerId);

      if (error) throw error;

      await loadPartners();
      toast({
        title: 'Status atualizado',
        description: `Parceiro ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do parceiro.',
        variant: 'destructive',
      });
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Parceiros Cadastrados</h2>
        <Badge variant="secondary" className="bg-slate-700">
          {partners.length} parceiros
        </Badge>
      </div>

      {partners.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Nenhum parceiro cadastrado ainda.</p>
            <p className="text-sm text-gray-500 mt-2">
              Os parceiros aparecerão aqui quando se cadastrarem através da página de cadastro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">
                      {partner.first_name} {partner.last_name}
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      Cadastrado em: {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {partner.slug && (
                      <p className="text-sm text-orange-400">
                        Link: /r/{partner.slug}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={partner.is_active ? "default" : "secondary"}
                      className={partner.is_active ? "bg-green-600" : "bg-red-600"}
                    >
                      {partner.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePartnerStatus(partner.id, partner.is_active)}
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      {partner.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{partner.whatsapp || 'Não informado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{partner.instagram || 'Não informado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 truncate">
                      {partner.pix_key || 'Não informado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
