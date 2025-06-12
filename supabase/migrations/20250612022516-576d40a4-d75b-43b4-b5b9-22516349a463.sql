
-- Primeiro, vamos adicionar colunas que podem estar faltando na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pix_key TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Atualizar a função que cria perfis automaticamente para incluir os novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, first_name, last_name, whatsapp, instagram, pix_key)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'whatsapp',
    NEW.raw_user_meta_data->>'instagram',
    NEW.raw_user_meta_data->>'pix_key'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar um usuário admin (substitua o email e senha conforme necessário)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@litoralpremia.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "name": "Administrador"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Atualizar a função para buscar números comprados por WhatsApp
CREATE OR REPLACE FUNCTION public.get_purchased_numbers_by_whatsapp(whatsapp_number TEXT)
RETURNS TABLE(
  sale_id UUID,
  numbers TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE,
  status TEXT,
  total_amount NUMERIC,
  quantity INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as sale_id,
    STRING_AGG(pn.number::TEXT, ', ' ORDER BY pn.number) as numbers,
    s.created_at as purchase_date,
    s.status::TEXT as status,
    s.total_amount,
    s.quantity
  FROM public.sales s
  LEFT JOIN public.purchased_numbers pn ON s.id = pn.sale_id
  WHERE s.customer_whatsapp = whatsapp_number
  GROUP BY s.id, s.created_at, s.status, s.total_amount, s.quantity
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
