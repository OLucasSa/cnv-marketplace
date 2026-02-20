import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ImageManagerProps {
  productId: number;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageManager({ productId, images = [], onImagesChange }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadMutation = trpc.upload.image.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        const result = await uploadMutation.mutateAsync({
          base64: base64Data,
          fileName: file.name,
        });

        if (result.url) {
          const newImages = [...(images || []), result.url];
          onImagesChange(newImages);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Imagens do Produto</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('image-input')?.click()}
          disabled={isUploading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isUploading ? 'Enviando...' : 'Adicionar Imagem'}
        </Button>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhuma imagem adicionada. Clique em "Adicionar Imagem" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
