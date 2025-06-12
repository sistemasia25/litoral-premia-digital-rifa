
-- Tabela de sorteios
CREATE TABLE public.sorteios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    banner_url TEXT,
    preco_padrao DECIMAL(10,2) NOT NULL DEFAULT 1.99,
    preco_com_desconto DECIMAL(10,2) DEFAULT 0.99,
    quantidade_minima_desconto INTEGER DEFAULT 10,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    total_numeros INTEGER NOT NULL DEFAULT 100000,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'finalizado', 'rascunho')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sorteio_id UUID REFERENCES public.sorteios(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    numeros TEXT[] NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de números premiados
CREATE TABLE public.numeros_premiados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sorteio_id UUID REFERENCES public.sorteios(id) ON DELETE CASCADE,
    numero TEXT NOT NULL,
    premio TEXT NOT NULL,
    descricao TEXT,
    data_sorteio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'premiado')),
    data_premiacao TIMESTAMP WITH TIME ZONE,
    cliente_id UUID REFERENCES public.clientes(id),
    comprovante_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sorteios finalizados (histórico)
CREATE TABLE public.sorteios_finalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sorteio_original_id UUID,
    premio_principal_descricao TEXT NOT NULL,
    premio_principal_imagem_url TEXT,
    data_finalizacao TIMESTAMP WITH TIME ZONE NOT NULL,
    numero_ganhador TEXT NOT NULL,
    ganhador_nome TEXT NOT NULL,
    ganhador_email TEXT NOT NULL,
    ganhador_telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de parceiros/afiliados
CREATE TABLE public.parceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    slug TEXT NOT NULL UNIQUE,
    comissao_percentual DECIMAL(5,2) DEFAULT 10.00,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas dos parceiros
CREATE TABLE public.vendas_parceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
    valor_venda DECIMAL(10,2) NOT NULL,
    comissao_valor DECIMAL(10,2) NOT NULL,
    comissao_percentual DECIMAL(5,2) NOT NULL,
    data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cliques dos parceiros
CREATE TABLE public.cliques_parceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    data_clique TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de saques dos parceiros
CREATE TABLE public.saques_parceiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'pago')),
    data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_processamento TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas porta a porta
CREATE TABLE public.vendas_porta_porta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id UUID REFERENCES public.parceiros(id) ON DELETE CASCADE,
    cliente_nome TEXT NOT NULL,
    cliente_telefone TEXT,
    numeros TEXT[] NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    comissao_valor DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS em todas as tabelas
ALTER TABLE public.sorteios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numeros_premiados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sorteios_finalizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliques_parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saques_parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_porta_porta ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para acesso público aos sorteios (leitura)
CREATE POLICY "Sorteios são públicos para leitura" ON public.sorteios FOR SELECT USING (true);
CREATE POLICY "Números premiados são públicos para leitura" ON public.numeros_premiados FOR SELECT USING (true);
CREATE POLICY "Sorteios finalizados são públicos para leitura" ON public.sorteios_finalizados FOR SELECT USING (true);

-- Políticas para clientes (podem ver seus próprios dados)
CREATE POLICY "Clientes podem ver seus próprios dados" ON public.clientes FOR SELECT USING (true);
CREATE POLICY "Clientes podem inserir seus dados" ON public.pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Clientes podem ver seus pedidos" ON public.pedidos FOR SELECT USING (true);

-- Políticas para parceiros (podem ver e gerenciar seus próprios dados)
CREATE POLICY "Parceiros podem ver seus próprios dados" ON public.parceiros FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parceiros podem atualizar seus dados" ON public.parceiros FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Parceiros podem ver suas vendas" ON public.vendas_parceiros FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parceiros WHERE parceiros.id = vendas_parceiros.parceiro_id AND parceiros.user_id = auth.uid())
);

CREATE POLICY "Parceiros podem ver seus cliques" ON public.cliques_parceiros FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.parceiros WHERE parceiros.id = cliques_parceiros.parceiro_id AND parceiros.user_id = auth.uid())
);

CREATE POLICY "Parceiros podem gerenciar seus saques" ON public.saques_parceiros FOR ALL USING (
    EXISTS (SELECT 1 FROM public.parceiros WHERE parceiros.id = saques_parceiros.parceiro_id AND parceiros.user_id = auth.uid())
);

CREATE POLICY "Parceiros podem gerenciar vendas porta a porta" ON public.vendas_porta_porta FOR ALL USING (
    EXISTS (SELECT 1 FROM public.parceiros WHERE parceiros.id = vendas_porta_porta.parceiro_id AND parceiros.user_id = auth.uid())
);

-- Criar índices para melhor performance
CREATE INDEX idx_sorteios_status ON public.sorteios(status);
CREATE INDEX idx_sorteios_data_fim ON public.sorteios(data_fim);
CREATE INDEX idx_pedidos_sorteio ON public.pedidos(sorteio_id);
CREATE INDEX idx_pedidos_cliente ON public.pedidos(cliente_id);
CREATE INDEX idx_numeros_premiados_sorteio ON public.numeros_premiados(sorteio_id);
CREATE INDEX idx_parceiros_slug ON public.parceiros(slug);
CREATE INDEX idx_vendas_parceiros_parceiro ON public.vendas_parceiros(parceiro_id);
CREATE INDEX idx_cliques_parceiros_parceiro ON public.cliques_parceiros(parceiro_id);
