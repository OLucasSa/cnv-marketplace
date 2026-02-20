import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  productName?: string;
}

export default function ImageCarousel({ images, productName = 'Produto' }: ImageCarouselProps) {
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
    <div className="relative w-full bg-secondary rounded-lg overflow-hidden group">
      {/* Main Image */}
      <div className="relative w-full h-96 flex items-center justify-center bg-secondary">
        {currentImage && (
          <img
            key={`${currentImage}-${validIndex}`}
            src={currentImage}
            alt={`${productName} - Imagem ${validIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

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

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {memoizedImages.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => goToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === validIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 w-2 hover:bg-white/70'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {validIndex + 1} / {memoizedImages.length}
          </div>
        </>
      )}
    </div>
  );
}
