
-- Atualizar o email do usuário admin existente
UPDATE auth.users 
SET email = 'sistemasia25@gmail.com',
    raw_user_meta_data = '{"role": "admin", "name": "Administrador"}'
WHERE email = 'admin@litoralpremia.com';

-- Atualizar o perfil correspondente
UPDATE public.profiles 
SET email = 'sistemasia25@gmail.com'
WHERE email = 'admin@litoralpremia.com';
