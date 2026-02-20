import { Product } from '@/lib/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, ShoppingCart, Info } from 'lucide-react';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import { parseColorIds, COLOR_PALETTE } from '@shared/colors';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  // Parse images
  const images = product.imageUrl
    ? product.imageUrl
        .split('|')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0)
    : [];

  const hasSizes = product.sizes && product.sizes.length > 0;
  
  // Parse colors from string to array of color objects
  const colorIds = parseColorIds(product.colors);
  const colors = colorIds
    .map(id => COLOR_PALETTE.find(c => c.id === id))
    .filter(Boolean) as typeof COLOR_PALETTE;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-4xl font-bold heading mb-2">
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

        {/* Main Content - Horizontal Layout for Desktop */}
        <div className="p-4 md:p-6">
          {/* Top Section: Images and Quick Info */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Left: Images - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-secondary/5 rounded-lg p-6">
                <ImageCarousel images={images} productName={product.name} />
              </div>
            </div>

            {/* Right: Price, Description, and CTA - Takes 2 columns on desktop */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {/* Price */}
              <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 md:p-6">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Preço</p>
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  {typeof product.price === 'string' ? product.price : `R$ ${product.price}`}
                </p>
              </div>

              {/* Description */}
              <div className="bg-secondary/5 rounded-lg p-4 md:p-6">
                <p className="text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent" />
                  Descrição
                </p>
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                  {product.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    const message = `Olá! Tenho interesse no produto: ${product.name}${
                      selectedColor ? ` na cor ${selectedColor}` : ''
                    }${selectedSize ? ` no tamanho ${selectedSize}` : ''}. Gostaria de saber mais sobre preços e disponibilidade.`;
                    const whatsappUrl = `https://wa.me/5566996066814?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-5 font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Solicitar Orçamento
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full py-5"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Colors, Sizes, Specs in 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 border-t border-border pt-6 md:pt-8">
            {/* Colors - Left Column */}
            <div>
              <p className="text-base md:text-lg font-bold heading mb-3 md:mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-accent rounded-full" />
                Cores
              </p>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {colors && colors.length > 0 ? (
                  colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
                        selectedColor === color.hex ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={color.displayName}
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-lg border-3 md:border-4 transition-all ${
                          selectedColor === color.hex
                            ? 'border-accent shadow-lg scale-110'
                            : 'border-border hover:border-accent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-xs text-center font-medium text-foreground line-clamp-1 text-[10px] md:text-xs">
                        {color.displayName}
                      </p>
                      {selectedColor === color.hex && (
                        <Check className="w-3 h-3 text-accent absolute mt-8" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-4">Sem cores</p>
                )}
              </div>
            </div>

            {/* Sizes & Specs - Middle Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Sizes */}
              {hasSizes && (
                <div>
                  <p className="text-base md:text-lg font-bold heading mb-2 md:mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    Tamanhos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all font-semibold text-sm ${
                          selectedSize === size
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'border-border hover:border-accent text-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div>
                <p className="text-base md:text-lg font-bold heading mb-2 md:mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-accent rounded-full" />
                  Especificações
                </p>
                <div className="space-y-1.5 md:space-y-2 bg-secondary/5 rounded-lg p-3 md:p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground text-sm">Material:</span>
                    <span className="text-muted-foreground text-sm">{product.specifications.material}</span>
                  </div>
                  {product.specifications.capacity && (
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="font-semibold text-foreground text-sm">Capacidade:</span>
                      <span className="text-muted-foreground text-sm">{product.specifications.capacity}</span>
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="font-semibold text-foreground text-sm">Dimensões:</span>
                      <span className="text-muted-foreground text-sm">{product.specifications.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features - Right Column */}
            {product.specifications.features && product.specifications.features.length > 0 && (
              <div>
                <p className="text-base md:text-lg font-bold heading mb-2 md:mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-accent rounded-full" />
                  Características
                </p>
                <div className="space-y-2">
                  {product.specifications.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-secondary/5 rounded-lg p-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
