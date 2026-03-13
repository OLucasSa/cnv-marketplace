import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
  productName?: string;
  onImageClick?: (imageUrl: string) => void;
}

export default function ProductImageGallery({ 
  images, 
  productName = 'Produto',
  onImageClick 
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize images to prevent unnecessary re-renders
  const memoizedImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.filter(img => img && img.trim().length > 0);
  }, [images]);

  // Validate current index
  const validIndex = useMemo(() => {
    if (memoizedImages.length === 0) return 0;
    return Math.min(currentIndex, memoizedImages.length - 1);
  }, [currentIndex, memoizedImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? memoizedImages.length - 1 : prev - 1;
      return Math.max(0, Math.min(newIndex, memoizedImages.length - 1));
    });
  }, [memoizedImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev === memoizedImages.length - 1 ? 0 : prev + 1;
      return Math.max(0, Math.min(newIndex, memoizedImages.length - 1));
    });
  }, [memoizedImages.length]);

  const goToIndex = useCallback((index: number) => {
    const validNewIndex = Math.max(0, Math.min(index, memoizedImages.length - 1));
    setCurrentIndex(validNewIndex);
  }, [memoizedImages.length]);

  if (!memoizedImages || memoizedImages.length === 0) {
    return (
      <div className="w-full h-96 bg-secondary rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const currentImage = memoizedImages[validIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative w-full bg-secondary rounded-lg overflow-hidden group aspect-square flex items-center justify-center">
        {currentImage && (
          <>
            <img
              key={`${currentImage}-${validIndex}`}
              src={currentImage}
              alt={`${productName} - Imagem ${validIndex + 1}`}
              className="w-full h-full object-contain cursor-zoom-in"
              loading="lazy"
              onClick={() => onImageClick?.(currentImage)}
            />
            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5" />
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        {memoizedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {validIndex + 1} / {memoizedImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {memoizedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {memoizedImages.map((image, index) => (
            <button
              key={`thumbnail-${index}`}
              onClick={() => goToIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === validIndex
                  ? 'border-accent ring-2 ring-accent'
                  : 'border-border hover:border-accent'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
