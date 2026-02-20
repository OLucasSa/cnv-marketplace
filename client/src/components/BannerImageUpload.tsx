import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  isLoading?: boolean;
}

export default function BannerImageUpload({
  onImageUpload,
  currentImage,
  isLoading = false,
}: BannerImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem');
      return false;
    }

    // Validar extensão PNG
    if (!file.name.toLowerCase().endsWith('.png')) {
      setError('Por favor, selecione um arquivo PNG');
      return false;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande (máximo 5MB)');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      // Criar FormData para upload
      const formData = new FormData();
      formData.append('file', file);

      // Fazer upload para o servidor
      const response = await fetch('/api/upload-banner', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      onImageUpload(data.url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-border bg-secondary/50 hover:border-accent'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          accept=".png,image/png"
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">
              Arraste uma imagem PNG aqui
            </p>
            <p className="text-sm text-muted-foreground">
              ou clique para selecionar um arquivo
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Máximo 5MB • Formato PNG
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {currentImage && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Imagem Atual:</p>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-secondary/50 border border-border">
            <img
              src={currentImage}
              alt="Banner atual"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center">
          Fazendo upload...
        </p>
      )}
    </div>
  );
}
