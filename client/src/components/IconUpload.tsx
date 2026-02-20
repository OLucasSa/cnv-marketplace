import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function IconUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Apenas arquivos PNG e JPG são aceitos');
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    // Ler arquivo e exibir preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error('Selecione uma imagem primeiro');
      return;
    }

    setIsLoading(true);
    try {
      // Simular upload - em produção, enviar para servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage como exemplo
      localStorage.setItem('cnv-system-icon', preview);
      
      // Atualizar ícone no documento
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (link) {
        link.href = preview;
      }
      
      toast.success('Ícone do sistema atualizado com sucesso!');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Erro ao fazer upload do ícone');
      console.error(error);
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
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Informações</h3>
          <p className="text-sm text-blue-800 mt-1">
            O ícone será exibido na aba do navegador e em favoritos. Recomendamos usar uma imagem quadrada (512x512px ou maior) em formato PNG ou JPG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div>
          <h3 className="text-lg font-semibold heading mb-4">Fazer Upload</h3>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">
              Clique para selecionar uma imagem
            </p>
            <p className="text-xs text-muted-foreground">
              PNG ou JPG (máximo 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="mt-4 space-y-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              Selecionar Arquivo
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div>
          <h3 className="text-lg font-semibold heading mb-4">Prévia</h3>
          
          {preview ? (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-8 bg-secondary/5 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview do ícone"
                  className="h-32 w-32 object-contain"
                />
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirmar Upload
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleRemove}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-8 bg-secondary/5 flex items-center justify-center h-48">
              <p className="text-sm text-muted-foreground text-center">
                Selecione uma imagem para visualizar a prévia
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Icon Info */}
      <div className="bg-secondary/5 border border-border rounded-lg p-4">
        <h3 className="font-semibold heading mb-2">Ícone Atual</h3>
        <p className="text-sm text-muted-foreground">
          O ícone atual é exibido na aba do navegador. Para alterar, faça upload de uma nova imagem acima.
        </p>
      </div>
    </div>
  );
}
