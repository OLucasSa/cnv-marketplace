import { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogoSettings() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('logoUrl');
    }
    return null;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validar tipo de arquivo
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setMessage({
        type: 'error',
        text: 'Apenas arquivos PNG e JPG são aceitos.',
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'Arquivo muito grande. Máximo 5MB.',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        // Salvar em localStorage
        localStorage.setItem('logoUrl', base64);
        setCurrentLogo(base64);

        setMessage({
          type: 'success',
          text: 'Logo atualizado com sucesso! Recarregue a página para ver as mudanças.',
        });

        // Disparar evento para atualizar componentes
        window.dispatchEvent(new Event('logoUpdated'));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao fazer upload da logo. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">GERENCIAR LOGO/ÍCONE DO HEADER</h2>
        <p className="text-muted-foreground">
          Altere o ícone/logo que aparece no topo do marketplace. Aceita PNG e JPG com até 5MB.
        </p>
      </div>

      {/* Área de Upload */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-border hover:border-accent hover:bg-accent/5'
        }`}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
          id="logo-input"
        />
        <label htmlFor="logo-input" className="cursor-pointer block">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="font-semibold mb-2">Arraste uma imagem PNG ou JPG aqui</p>
          <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
          <Button variant="outline" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Selecionar Arquivo'}
          </Button>
        </label>
      </div>

      {/* Mensagem de Status */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Preview da Logo Atual */}
      {currentLogo && (
        <div className="border rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">Preview da Logo Atual:</p>
          <div className="flex items-center justify-center bg-gray-100 rounded p-4">
            <img
              src={currentLogo}
              alt="Logo Preview"
              className="h-16 object-contain"
            />
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">💡 Dicas:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use imagens PNG com fundo transparente para melhor resultado</li>
          <li>Tamanho recomendado: 40x40 pixels ou 80x80 pixels</li>
          <li>A imagem será exibida no topo esquerdo do marketplace</li>
          <li>Você pode substituir a logo a qualquer momento</li>
        </ul>
      </div>
    </div>
  );
}
