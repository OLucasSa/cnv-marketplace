import { useState, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  productName = 'Produto',
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Limit dragging to image bounds
    const maxX = (containerRef.current.clientWidth * (zoom - 1)) / 2;
    const maxY = (containerRef.current.clientHeight * (zoom - 1)) / 2;

    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[2001] bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
        aria-label="Fechar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
      >
        <img
          ref={imageRef}
          src={currentImage}
          alt={`${productName} - Imagem ${currentIndex + 1}`}
          className="max-w-full max-h-full cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          onWheel={handleWheel}
          onLoad={() => resetZoom()}
        />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          className="text-white hover:bg-white/20"
          aria-label="Diminuir zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>

        <div className="flex items-center px-3 text-white text-sm min-w-[60px] justify-center">
          {Math.round(zoom * 100)}%
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          className="text-white hover:bg-white/20"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        <div className="w-px bg-white/20" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            resetZoom();
          }}
          className="text-white hover:bg-white/20 px-3"
          aria-label="Resetar zoom"
        >
          Resetar
        </Button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center">
        <p>Use as setas para navegar • Scroll para zoom • Arraste para mover</p>
      </div>
    </div>
  );
}
