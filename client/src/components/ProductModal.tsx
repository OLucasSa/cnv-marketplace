import { Product } from '@/lib/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) return null;

  // Parse images
  const images = product.imageUrl
    ? product.imageUrl
        .split('|')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-3xl font-bold heading mb-2">
              {product.name}
            </DialogTitle>
            <p className="text-sm text-accent uppercase tracking-wider font-semibold">
              {product.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary/20 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="bg-secondary/5 rounded-lg p-6">
              <ImageCarousel images={images} productName={product.name} />
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Price */}
              <div className="bg-accent/10 border-2 border-accent rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Preço</p>
                <p className="text-3xl font-bold text-accent">
                  {typeof product.price === 'string' ? product.price : `R$ ${product.price}`}
                </p>
              </div>

              {/* Description */}
              <div className="bg-secondary/5 rounded-lg p-6">
                <p className="text-sm font-semibold text-foreground mb-3">Descrição</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const message = `Olá! Tenho interesse no produto: ${product.name}${
                      selectedColor ? ` na cor ${selectedColor}` : ''
                    }. Gostaria de saber mais sobre preços e disponibilidade.`;
                    const whatsappUrl = `https://wa.me/5566996066814?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-6 font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Solicitar Orçamento
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full py-6"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          {product.colors && product.colors.length > 0 && (
            <div className="border-t border-border pt-8">
              <p className="text-lg font-bold heading mb-6">Cores Disponíveis</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`flex flex-col items-center gap-3 transition-all duration-300 ${
                      selectedColor === color.hex ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full border-4 transition-all shadow-md ${
                        selectedColor === color.hex
                          ? 'border-accent scale-110'
                          : 'border-gray-300 hover:border-accent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <p className="text-xs text-center font-medium text-foreground line-clamp-2 w-20">
                      {color.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
