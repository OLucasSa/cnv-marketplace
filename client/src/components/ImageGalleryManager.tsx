import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ImageGalleryManagerProps {
  imageString: string | null;
  onImagesChange: (imageString: string) => void;
}

export default function ImageGalleryManager({ imageString, onImagesChange }: ImageGalleryManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const uploadMutation = trpc.upload.image.useMutation();

  // Parse images from string (separated by |)
  const images = imageString ? imageString.split('|').filter(url => url.trim()) : [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        const result = await uploadMutation.mutateAsync({
          base64: base64Data,
          fileName: file.name,
        });

        if (result.url) {
          const newImages = [...images, result.url];
          const newImageString = newImages.join('|');
          onImagesChange(newImageString);
          toast.success('Imagem adicionada com sucesso!');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageString = newImages.join('|');
    onImagesChange(newImageString);
    toast.success('Imagem removida');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    // Reorder images
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove from original position
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);

    const newImageString = newImages.join('|');
    onImagesChange(newImageString);
    setDraggedIndex(null);
    toast.success('Imagens reordenadas com sucesso!');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Galeria de Imagens</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('gallery-input')?.click()}
          disabled={isUploading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isUploading ? 'Enviando...' : 'Adicionar Imagem'}
        </Button>
        <input
          id="gallery-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Grid with Drag-and-Drop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-move transition-all duration-200 ${
                draggedIndex === index
                  ? 'opacity-50 scale-95'
                  : dragOverIndex === index
                  ? 'ring-2 ring-accent scale-105 bg-accent/10'
                  : ''
              }`}
            >
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-border"
                draggable={false}
              />
              
              {/* Drag Handle */}
              <div className="absolute top-1 left-1 bg-black/50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3" />
              </div>

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              {/* Image Number */}
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
            Nenhuma imagem. Clique em "Adicionar Imagem" para começar.
          </div>
        )}
      </div>

      {/* Drag Hint */}
      {images.length > 1 && (
        <p className="text-xs text-muted-foreground text-center">
          💡 Dica: Arraste as imagens para reordenar a galeria
        </p>
      )}
    </div>
  );
}
