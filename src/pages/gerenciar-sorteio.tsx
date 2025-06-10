import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, TrendingUp, Clock, Upload, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GerenciarSorteio = () => {
  const { toast } = useToast();
  
  // Estado para o banner
  const [bannerUrl, setBannerUrl] = useState("/banner-avelloz-2025.png");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  // Estado para os cards informativos
  const [cards, setCards] = useState({
    premio: {
      titulo: "Prêmio Principal",
      descricao: "Avelloz 2025 0km",
      rodape: "ou R$ 90.000,00",
      icone: "gift"
    },
    desconto: {
      titulo: "Desconto Especial",
      descricao: "Combo com 25% OFF",
      rodape: "Apenas R$ 0,99",
      icone: "trending-up"
    },
    tempo: {
      titulo: "Termina em",
      descricao: "51d 10h 30m",
      rodape: "Não perca essa chance!",
      icone: "clock"
    }
  });
  
  // Estado para preços
  const [precos, setPrecos] = useState({
    precoPadrao: 1.99,
    precoComDesconto: 0.99,
    quantidadeMinimaDesconto: 10
  });

  // Função para lidar com o upload do banner
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  // Função para salvar as alterações
  const salvarAlteracoes = () => {
    // Aqui você implementaria a lógica para salvar no banco de dados
    toast({
      title: "Sucesso!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Gerenciar Sorteio</h1>
      
      {/* Seção do Banner */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Banner Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <img 
              src={bannerUrl} 
              alt="Banner do Sorteio" 
              className="w-full h-auto max-h-80 object-cover rounded-lg"
            />
          </div>
          <div>
            <Label className="block text-gray-300 mb-2">Alterar Banner</Label>
            <div className="flex items-center space-x-2">
              <label className="flex-1">
                <div className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-slate-700">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Selecionar arquivo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                </div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção dos Cards Informativos */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Cards Informativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card do Prêmio */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-orange-400 font-medium mb-4">Card do Prêmio</h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-gray-300 text-sm">Título</Label>
                  <Input 
                    value={cards.premio.titulo} 
                    onChange={(e) => setCards({...cards, premio: {...cards.premio, titulo: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Descrição</Label>
                  <Input 
                    value={cards.premio.descricao} 
                    onChange={(e) => setCards({...cards, premio: {...cards.premio, descricao: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Rodapé</Label>
                  <Input 
                    value={cards.premio.rodape} 
                    onChange={(e) => setCards({...cards, premio: {...cards.premio, rodape: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Card de Desconto */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-orange-400 font-medium mb-4">Card de Desconto</h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-gray-300 text-sm">Título</Label>
                  <Input 
                    value={cards.desconto.titulo} 
                    onChange={(e) => setCards({...cards, desconto: {...cards.desconto, titulo: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Descrição</Label>
                  <Input 
                    value={cards.desconto.descricao} 
                    onChange={(e) => setCards({...cards, desconto: {...cards.desconto, descricao: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Rodapé</Label>
                  <Input 
                    value={cards.desconto.rodape} 
                    onChange={(e) => setCards({...cards, desconto: {...cards.desconto, rodape: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Card do Tempo */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="text-orange-400 font-medium mb-4">Card do Tempo</h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-gray-300 text-sm">Título</Label>
                  <Input 
                    value={cards.tempo.titulo} 
                    onChange={(e) => setCards({...cards, tempo: {...cards.tempo, titulo: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Descrição</Label>
                  <Input 
                    value={cards.tempo.descricao} 
                    onChange={(e) => setCards({...cards, tempo: {...cards.tempo, descricao: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Rodapé</Label>
                  <Input 
                    value={cards.tempo.rodape} 
                    onChange={(e) => setCards({...cards, tempo: {...cards.tempo, rodape: e.target.value}})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Preços */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Configurações de Preço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-300">Preço por Número (R$)</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0"
                value={precos.precoPadrao}
                onChange={(e) => setPrecos({...precos, precoPadrao: parseFloat(e.target.value)})}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Preço com Desconto (R$)</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0"
                value={precos.precoComDesconto}
                onChange={(e) => setPrecos({...precos, precoComDesconto: parseFloat(e.target.value)})}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Quantidade Mínima para Desconto</Label>
              <Input 
                type="number" 
                min="2"
                value={precos.quantidadeMinimaDesconto}
                onChange={(e) => setPrecos({...precos, quantidadeMinimaDesconto: parseInt(e.target.value)})}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
            <h4 className="text-orange-400 font-medium mb-2">Visualização do Preço</h4>
            <p className="text-sm text-gray-300">
              {precos.quantidadeMinimaDesconto > 1 
                ? `Preço normal: R$ ${precos.precoPadrao.toFixed(2)} por número. `
                : 'Sem desconto ativo. '}
              {precos.quantidadeMinimaDesconto > 1 && 
                `Com ${precos.quantidadeMinimaDesconto}+ números: R$ ${precos.precoComDesconto.toFixed(2)} cada.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={salvarAlteracoes}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default GerenciarSorteio;
