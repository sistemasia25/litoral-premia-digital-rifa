// Tipos para a estrutura de dados do sorteio

// Representa um cliente/comprador
export interface Cliente {
  nome: string;
  email: string;
  telefone?: string;
}

// Representa um prêmio instantâneo (número premiado)
export interface NumeroPremiado {
  numero: string;
  premio: string;
  descricao: string;
  dataSorteio: string; // Data de criação do prêmio
  ativo: boolean;
  status: 'disponivel' | 'reservado' | 'premiado';
  dataPremiacao: string | null;
  cliente: Cliente | null;
  comprovanteUrl?: string;
}

// Representa um pedido de compra de números
export interface Pedido {
  id: string; // ID único do pedido
  cliente: Cliente;
  numeros: string[]; // Números que o cliente comprou
  valorTotal: number;
  dataPedido: string;
  status: 'pendente' | 'pago' | 'cancelado';
}

// Representa um sorteio que já foi finalizado
export interface SorteioFinalizado {
  id: string; // ID único para o sorteio finalizado
  premioPrincipal: {
    descricao: string;
    imagemUrl: string;
  };
  dataFinalizacao: string;
  numeroGanhador: string;
  ganhadorInfo: Cliente;
}

// Representa os cards de informação na página principal
export interface RaffleCard {
  titulo: string;
  descricao: string;
  rodape: string;
  icone: string;
}

// Representa a estrutura de preços
export interface RafflePrices {
  precoPadrao: number;
  precoComDesconto: number;
  quantidadeMinimaDesconto: number;
}

// Estrutura principal de dados do sorteio
export interface RaffleData {
  bannerUrl: string;
  cards: {
    premio: RaffleCard;
    desconto: RaffleCard;
    tempo: RaffleCard;
  };
  precos: RafflePrices;
  endDate: string; // Data no formato ISO (ex: '2024-12-31T23:59:59.999Z')
  totalNumeros: number; // Quantidade total de números disponíveis no sorteio
  numerosPremiados: NumeroPremiado[];
  pedidos: Pedido[];
  historico: SorteioFinalizado[];
}

// Contexto do Sorteio
export interface RaffleContextType extends RaffleData {
  updateRaffleData: (data: Partial<RaffleData>) => void;
}
