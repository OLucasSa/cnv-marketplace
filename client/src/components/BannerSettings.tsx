import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

export default function BannerSettings() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Carregar imagem atual do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bannerImageUrl');
    if (stored) {
      setCurrentImage(stored);
    }
  }, []);

  // Mutation para upload
  const uploadMutation = trpc.upload.bannerImage.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        // Salvar URL em localStorage
        localStorage.setItem('bannerImageUrl', result.url);
        setCurrentImage(result.url);
        setSuccess(true);
        setError(null);

        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(false), 3000);

        // Recarregar página para atualizar banner
        setTimeout(() => window.location.reload(), 1500);
      }
    },
    onError: (error) => {
      setError(error.message || 'Erro ao fazer upload');
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    // Converter arquivo para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      // Fazer upload via tRPC
      uploadMutation.mutate({
        base64,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleRemoveImage = () => {
    localStorage.removeItem('bannerImageUrl');
    setCurrentImage(null);
    setSuccess(false);
    window.location.reload();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Gerenciar Imagem do Banner
        </h2>
        <p className="text-muted-foreground">
          Faça upload de uma imagem PNG para exibir no banner principal do site
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,image/png"
        onChange={handleFileInput}
        disabled={uploadMutation.isPending}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-border bg-secondary/50 hover:border-accent'
        } ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Imagem enviada com sucesso!</p>
        </div>
      )}

      {/* Loading State */}
      {uploadMutation.isPending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">Fazendo upload da imagem...</p>
        </div>
      )}

      {/* Current Image Preview */}
      {currentImage && (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Imagem Atual:
            </p>
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-secondary/50 border border-border">
              <img
                src={currentImage}
                alt="Banner atual"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <Button
            onClick={handleRemoveImage}
            variant="destructive"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Remover Imagem
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Dica:</strong> A imagem será exibida na frente dos quadrados amarelos no banner principal do site. Use uma imagem PNG com fundo transparente para melhores resultados.
        </p>
      </div>
    </div>
  );
}
