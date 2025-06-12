
-- Adicionar novos campos à tabela parceiros
ALTER TABLE public.parceiros 
ADD COLUMN IF NOT EXISTS cidade text,
ADD COLUMN IF NOT EXISTS estado text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS chave_pix text;

-- Criar índice único para o slug se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'parceiros_slug_unique') THEN
        CREATE UNIQUE INDEX parceiros_slug_unique ON public.parceiros(slug);
    END IF;
END $$;

-- Habilitar RLS na tabela parceiros
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.parceiros;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios dados" ON public.parceiros;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.parceiros;

-- Criar políticas RLS
CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.parceiros 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios dados" 
ON public.parceiros 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" 
ON public.parceiros 
FOR UPDATE 
USING (auth.uid() = user_id);
