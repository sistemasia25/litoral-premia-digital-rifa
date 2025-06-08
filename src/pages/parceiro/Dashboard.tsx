import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerLayout } from '@/components/parceiro/PartnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Users, 
  DollarSign, 
  Link2, // Icon for Link
  Copy,  // Icon for Copy
  Send,  // Icon for Gerar Venda
  Loader2
} from 'lucide-react';

const PRECO_POR_NUMERO = 5.00;

export default function Dashboard() {
  const { user } = useAuth();

  // Card states
  const [cliquesHoje, setCliquesHoje] = useState(45);
  const [vendasHoje, setVendasHoje] = useState(8);
  const [comissaoHoje, setComissaoHoje] = useState(24.00);
  const [saldoDisponivel, setSaldoDisponivel] = useState(380.50);

  // Link de Divulgação states
  const [codigoReferencia, setCodigoReferencia] = useState("MARIA2024");
  const [linkCompleto, setLinkCompleto] = useState("https://litoraldasorte.com/r/MARIA2024");

  // Solicitar Saque states
  const [valorSaque, setValorSaque] = useState('');
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);

  // Venda Porta a Porta states
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpfCliente, setCpfCliente] = useState('');
  const [whatsappCliente, setWhatsappCliente] = useState('');
  const [cidadeCliente, setCidadeCliente] = useState('');
  const [quantidadeNumeros, setQuantidadeNumeros] = useState(1);
  const [valorTotalVenda, setValorTotalVenda] = useState(PRECO_POR_NUMERO);
  const [isGeneratingSale, setIsGeneratingSale] = useState(false);

  useEffect(() => {
    setValorTotalVenda(quantidadeNumeros * PRECO_POR_NUMERO);
  }, [quantidadeNumeros]);

  const handleCopy = async (textToCopy: string, type: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert(`${type} copiado para a área de transferência!`);
    } catch (err) {
      alert(`Falha ao copiar ${type}.`);
    }
  };

  const handleRequestWithdrawal = () => {
    if (!valorSaque || isNaN(Number(valorSaque)) || Number(valorSaque) <= 0) {
      alert('Por favor, insira um valor válido para saque.');
      return;
    }
    if (Number(valorSaque) > saldoDisponivel) {
      alert('Saldo insuficiente para o saque.');
      return;
    }
    setIsRequestingWithdrawal(true);
    // Simular requisição de saque
    setTimeout(() => {
      alert(`Saque de R$ ${Number(valorSaque).toFixed(2)} solicitado com sucesso!`);
      // TODO: Atualizar saldoDisponivel após o saque
      setValorSaque('');
      setIsRequestingWithdrawal(false);
    }, 1500);
  };

  const handleGerarVenda = () => {
    // Validação básica
    if (!nomeCliente || !cpfCliente || !whatsappCliente || !cidadeCliente || quantidadeNumeros <= 0) {
      alert('Por favor, preencha todos os campos da venda.');
      return;
    }
    setIsGeneratingSale(true);
    // Simular geração de venda
    setTimeout(() => {
      alert(`Venda de ${quantidadeNumeros} número(s) para ${nomeCliente} no valor de R$ ${valorTotalVenda.toFixed(2)} gerada com sucesso!`);
      // Resetar formulário
      setNomeCliente('');
      setCpfCliente('');
      setWhatsappCliente('');
      setCidadeCliente('');
      setQuantidadeNumeros(1);
      setIsGeneratingSale(false);
    }, 1500);
  };

  return (
    <PartnerLayout>
      <div className="p-4 md:p-8 space-y-6 bg-slate-900 text-white min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard do Influenciador</h2>
            <p className="text-muted-foreground text-slate-400">
              Bem-vinda, {user?.name || 'Maria Oliveira'}!
            </p>
          </div>
          {/* O botão Sair geralmente está no PartnerLayout, mas se não estiver, pode ser adicionado aqui */}
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Cliques Hoje</CardTitle>
              <Eye className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{cliquesHoje}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Vendas Hoje</CardTitle>
              <Users className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{vendasHoje}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Comissão Hoje</CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {comissaoHoje.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Saldo Disponível</CardTitle>
              <DollarSign className="h-5 w-5 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ {saldoDisponivel.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seu Link de Divulgação */}
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700 p-6">
            <CardTitle className="text-xl font-semibold mb-4 text-white flex items-center">
              <Link2 className="h-5 w-5 mr-2 text-indigo-400" /> Seu Link de Divulgação
            </CardTitle>
            <div className="space-y-4">
              <div>
                <label htmlFor="codigoReferencia" className="block text-sm font-medium text-slate-300 mb-1">Código de Referência</label>
                <div className="flex">
                  <Input id="codigoReferencia" type="text" value={codigoReferencia} readOnly className="bg-slate-700 border-slate-600 text-white flex-grow" />
                  <Button onClick={() => handleCopy(codigoReferencia, 'Código de Referência')} variant="outline" className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="linkCompleto" className="block text-sm font-medium text-slate-300 mb-1">Link Completo</label>
                <div className="flex">
                  <Input id="linkCompleto" type="text" value={linkCompleto} readOnly className="bg-slate-700 border-slate-600 text-white flex-grow" />
                  <Button onClick={() => handleCopy(linkCompleto, 'Link Completo')} variant="outline" className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Solicitar Saque */}
          <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6">
            <CardTitle className="text-xl font-semibold mb-4 text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-emerald-400" /> Solicitar Saque
            </CardTitle>
            <div className="space-y-4">
              <p className="text-slate-300">Saldo Disponível: <span className="font-bold text-lg text-emerald-400">R$ {saldoDisponivel.toFixed(2)}</span></p>
              <div>
                <label htmlFor="valorSaque" className="block text-sm font-medium text-slate-300 mb-1">Valor do Saque</label>
                <Input 
                  id="valorSaque"
                  type="number" 
                  placeholder="0.00"
                  value={valorSaque} 
                  onChange={(e) => setValorSaque(e.target.value)} 
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={handleRequestWithdrawal} 
                disabled={isRequestingWithdrawal || Number(valorSaque) <= 0 || Number(valorSaque) > saldoDisponivel}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-base disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {isRequestingWithdrawal ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                ) : (saldoDisponivel < 50 ? 'Disponível sextas 9h (Mín. R$50)' : 'Solicitar Saque')}
                 {/* Exemplo de lógica para o texto do botão, pode ser ajustado */}
              </Button>
              <p className="text-xs text-slate-400 text-center">O valor mínimo para saque é R$ 50,00. Saques disponíveis às sextas-feiras, 9h.</p>
            </div>
          </Card>
        </div>

        {/* Venda Porta a Porta */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <CardTitle className="text-xl font-semibold mb-1 text-white">Venda Porta a Porta</CardTitle>
          <p className="text-sm text-slate-400 mb-6">Registre uma venda presencial. Os números serão gerados e o acerto será feito no final do dia.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nomeCliente" className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
              <Input id="nomeCliente" type="text" placeholder="Nome do cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <label htmlFor="cpfCliente" className="block text-sm font-medium text-slate-300 mb-1">CPF</label>
              <Input id="cpfCliente" type="text" placeholder="000.000.000-00" value={cpfCliente} onChange={(e) => setCpfCliente(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <label htmlFor="whatsappCliente" className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
              <Input id="whatsappCliente" type="text" placeholder="(00) 00000-0000" value={whatsappCliente} onChange={(e) => setWhatsappCliente(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <label htmlFor="cidadeCliente" className="block text-sm font-medium text-slate-300 mb-1">Cidade</label>
              <Input id="cidadeCliente" type="text" placeholder="Cidade do cliente" value={cidadeCliente} onChange={(e) => setCidadeCliente(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <label htmlFor="quantidadeNumeros" className="block text-sm font-medium text-slate-300 mb-1">Quantidade de Números</label>
              <Input id="quantidadeNumeros" type="number" value={quantidadeNumeros} onChange={(e) => setQuantidadeNumeros(Math.max(1, Number(e.target.value)))} min="1" className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <label htmlFor="valorTotalVenda" className="block text-sm font-medium text-slate-300 mb-1">Valor Total</label>
              <Input id="valorTotalVenda" type="text" value={`R$ ${valorTotalVenda.toFixed(2)}`} readOnly className="bg-slate-700 border-slate-600 text-white font-bold" />
            </div>
          </div>
          <Button 
            onClick={handleGerarVenda} 
            disabled={isGeneratingSale} 
            className="mt-6 w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 text-base flex items-center justify-center disabled:bg-slate-600"
          >
            {isGeneratingSale ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : <><Send className="mr-2 h-4 w-4" /> Gerar Venda</>}
          </Button>
        </Card>
      </div>
    </PartnerLayout>
  );
}
