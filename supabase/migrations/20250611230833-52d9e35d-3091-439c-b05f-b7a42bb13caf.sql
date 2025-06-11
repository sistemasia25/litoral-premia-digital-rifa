
-- Criar enum para status de sorteios
CREATE TYPE public.raffle_status AS ENUM ('active', 'finished', 'cancelled');

-- Criar enum para status de vendas
CREATE TYPE public.sale_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Criar enum para status de saques
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'processed', 'failed');

-- Criar enum para métodos de pagamento
CREATE TYPE public.payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'money', 'bank_transfer');

-- Criar enum para tipos de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'partner', 'customer');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  cpf TEXT,
  city TEXT,
  state TEXT,
  instagram TEXT,
  slug TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de sorteios
CREATE TABLE public.raffles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  total_numbers INTEGER NOT NULL DEFAULT 10000,
  price_per_number DECIMAL(10,2) NOT NULL DEFAULT 1.99,
  discount_price DECIMAL(10,2) DEFAULT 0.99,
  discount_min_quantity INTEGER DEFAULT 10,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  status raffle_status NOT NULL DEFAULT 'active',
  draw_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  rules TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de prêmios do sorteio
CREATE TABLE public.raffle_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(10,2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de números premiados
CREATE TABLE public.winning_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  prize_id UUID REFERENCES public.raffle_prizes(id),
  winner_profile_id UUID REFERENCES public.profiles(id),
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(raffle_id, number)
);

-- Tabela de vendas
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  customer_profile_id UUID REFERENCES public.profiles(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_whatsapp TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  partner_id UUID REFERENCES public.profiles(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  status sale_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  payment_id TEXT,
  is_door_to_door BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de números comprados
CREATE TABLE public.purchased_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(raffle_id, number)
);

-- Tabela de cliques de parceiros
CREATE TABLE public.partner_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  converted BOOLEAN NOT NULL DEFAULT false,
  sale_id UUID REFERENCES public.sales(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de saques
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status withdrawal_status NOT NULL DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  payment_details JSONB NOT NULL,
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winning_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view partner profiles" ON public.profiles
  FOR SELECT USING (role = 'partner' AND is_active = true);

-- Políticas para raffles (públicas para visualização)
CREATE POLICY "Anyone can view active raffles" ON public.raffles
  FOR SELECT USING (status = 'active');

-- Políticas para raffle_prizes (públicas para visualização)
CREATE POLICY "Anyone can view raffle prizes" ON public.raffle_prizes
  FOR SELECT USING (true);

-- Políticas para winning_numbers (públicas para visualização)
CREATE POLICY "Anyone can view winning numbers" ON public.winning_numbers
  FOR SELECT USING (true);

-- Políticas para sales
CREATE POLICY "Users can view their own sales" ON public.sales
  FOR SELECT USING (
    auth.uid() = customer_profile_id OR 
    auth.uid() = partner_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners can create sales" ON public.sales
  FOR INSERT WITH CHECK (
    auth.uid() = partner_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'partner'))
  );

-- Políticas para purchased_numbers
CREATE POLICY "Users can view their purchased numbers" ON public.purchased_numbers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sales s 
      WHERE s.id = sale_id AND (
        s.customer_profile_id = auth.uid() OR 
        s.partner_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Políticas para partner_clicks
CREATE POLICY "Partners can view their own clicks" ON public.partner_clicks
  FOR SELECT USING (auth.uid() = partner_id);

CREATE POLICY "Anyone can create clicks" ON public.partner_clicks
  FOR INSERT WITH CHECK (true);

-- Políticas para withdrawals
CREATE POLICY "Partners can view their own withdrawals" ON public.withdrawals
  FOR SELECT USING (auth.uid() = partner_id);

CREATE POLICY "Partners can create withdrawal requests" ON public.withdrawals
  FOR INSERT WITH CHECK (auth.uid() = partner_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_raffles_updated_at
  BEFORE UPDATE ON public.raffles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir sorteio inicial
INSERT INTO public.raffles (
  title,
  description,
  total_numbers,
  price_per_number,
  discount_price,
  discount_min_quantity,
  commission_rate,
  status,
  draw_date,
  rules
) VALUES (
  'Litoral Premia 2025',
  'Sorteio oficial do Litoral Premia com prêmios incríveis!',
  10000,
  1.99,
  0.99,
  10,
  30.00,
  'active',
  '2025-12-31 20:00:00-03',
  'Regulamento completo disponível no site oficial.'
);

-- Inserir prêmios para o sorteio
INSERT INTO public.raffle_prizes (raffle_id, position, title, description, value)
SELECT 
  r.id,
  1,
  '1º Prêmio - R$ 50.000',
  'Prêmio principal do sorteio',
  50000.00
FROM public.raffles r WHERE r.title = 'Litoral Premia 2025';

INSERT INTO public.raffle_prizes (raffle_id, position, title, description, value)
SELECT 
  r.id,
  2,
  '2º Prêmio - R$ 20.000',
  'Segundo prêmio do sorteio',
  20000.00
FROM public.raffles r WHERE r.title = 'Litoral Premia 2025';

INSERT INTO public.raffle_prizes (raffle_id, position, title, description, value)
SELECT 
  r.id,
  3,
  '3º Prêmio - R$ 10.000',
  'Terceiro prêmio do sorteio',
  10000.00
FROM public.raffles r WHERE r.title = 'Litoral Premia 2025';
