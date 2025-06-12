
-- Criar bucket para banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true);

-- Criar políticas para o bucket de banners (acesso público para visualização)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

-- Política para upload de banners (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload banners" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Política para atualizar banners (apenas usuários autenticados)
CREATE POLICY "Authenticated users can update banners" ON storage.objects
FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- Política para deletar banners (apenas usuários autenticados)
CREATE POLICY "Authenticated users can delete banners" ON storage.objects
FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');
