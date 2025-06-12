
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, bucket: string = 'banners'): Promise<string | null> => {
    try {
      setUploading(true);
      console.log('Iniciando upload do arquivo:', file.name, 'para bucket:', bucket);

      // Verificar se o arquivo é uma imagem
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 5MB permitido');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Nome do arquivo gerado:', fileName);

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      console.log('Upload realizado com sucesso:', data);

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', publicUrl);

      toast({
        title: 'Upload realizado!',
        description: 'Imagem enviada com sucesso.',
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message || 'Erro ao fazer upload da imagem',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
  };
};
