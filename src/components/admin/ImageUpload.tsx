
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, label = "Imagem", placeholder = "URL da imagem ou faça upload" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Converter para base64 para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        
        toast({
          title: 'Sucesso',
          description: 'Imagem carregada com sucesso!',
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da imagem.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-gray-300">{label}</Label>
      
      {/* Preview da imagem */}
      {preview && (
        <div className="relative inline-block">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full h-32 object-cover rounded-lg border border-slate-600"
            onError={() => {
              setPreview('');
              toast({
                title: 'Erro',
                description: 'Não foi possível carregar a imagem.',
                variant: 'destructive',
              });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input de URL */}
      <Input
        value={value}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-700 border-slate-600 text-white"
      />

      {/* Upload de arquivo */}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <Label
          htmlFor="image-upload"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md cursor-pointer transition-colors"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Fazer Upload
            </>
          )}
        </Label>
        
        {!preview && (
          <div className="flex items-center text-gray-400 text-sm">
            <Image className="h-4 w-4 mr-1" />
            PNG, JPG, WEBP até 5MB
          </div>
        )}
      </div>
    </div>
  );
}
