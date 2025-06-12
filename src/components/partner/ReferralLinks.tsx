
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralLinksProps {
  codigoReferencia: string;
  linkAfiliado: string;
}

export function ReferralLinks({ codigoReferencia, linkAfiliado }: ReferralLinksProps) {
  const [copied, setCopied] = useState('');
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
    
    toast({
      title: "Copiado!",
      description: `${type === 'código' ? 'Código de referência' : 'Link de afiliado'} copiado para a área de transferência.`,
    });
  };

  const openLink = () => {
    window.open(linkAfiliado, '_blank');
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-indigo-400" /> Seus Links de Divulgação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="codigoReferencia" className="block text-sm font-medium text-slate-300 mb-1">
            Código de Referência
          </label>
          <div className="flex">
            <Input 
              id="codigoReferencia" 
              type="text" 
              value={codigoReferencia} 
              readOnly 
              className="bg-slate-700 border-slate-600 text-white flex-grow" 
            />
            <Button 
              onClick={() => handleCopy(codigoReferencia, 'código')} 
              variant="outline" 
              className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500"
            >
              {copied === 'código' ? 'Copiado!' : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="linkAfiliado" className="block text-sm font-medium text-slate-300 mb-1">
            Link de Afiliado para Vendas
          </label>
          <div className="flex">
            <Input 
              id="linkAfiliado" 
              type="text" 
              value={linkAfiliado} 
              readOnly 
              className="bg-slate-700 border-slate-600 text-white flex-grow" 
            />
            <Button 
              onClick={() => handleCopy(linkAfiliado, 'link')} 
              variant="outline" 
              className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500"
            >
              {copied === 'link' ? 'Copiado!' : <Copy className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={openLink}
              variant="outline" 
              className="ml-2 bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Este link direciona os clientes para a página de vendas do sorteio ativo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
