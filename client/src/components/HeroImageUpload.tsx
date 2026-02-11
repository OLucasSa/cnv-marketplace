import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface HeroImageUploadProps {
  currentImageUrl?: string;
  onSuccess?: () => void;
}

export default function HeroImageUpload({ currentImageUrl, onSuccess }: HeroImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.upload.image.useMutation();
  const updateHeroMutation = trpc.settings.updateHeroImage.useMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload para storage
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadMutation.mutateAsync(formData as any);

      if (result.url && result.key) {
        // Atualizar configuração no banco
        await updateHeroMutation.mutateAsync({
          heroImageUrl: result.url,
          heroImageKey: result.key,
        });

        toast.success('Imagem da hero atualizada com sucesso!');
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
      setPreview(currentImageUrl || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Trocar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-semibold">Clique para fazer upload</p>
              <p className="text-sm text-muted-foreground">ou arraste uma imagem aqui</p>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF até 5MB</p>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center">Fazendo upload...</p>
      )}
    </div>
  );
}
