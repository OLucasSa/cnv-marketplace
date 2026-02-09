import { Product } from '@/lib/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
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
            className="rounded-full p-2 hover:bg-secondary/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Color Swatches */}
            <div>
              <p className="text-sm font-semibold mb-3 heading">Cores Disponíveis</p>
              <div className="grid grid-cols-4 gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`relative group transition-all duration-300 ${
                      selectedColor === color.hex ? 'ring-2 ring-accent ring-offset-2' : ''
                    }`}
                  >
                    <div
                      className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        borderColor: selectedColor === color.hex ? '#FFD700' : '#E0E0E0',
                      }}
                    />
                    <p className="text-xs text-center mt-2 font-medium text-foreground">
                      {color.name}
                    </p>
                    {selectedColor === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-accent" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Descrição</p>
              <p className="text-base text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="border-t border-border pt-6">
              <p className="text-lg font-bold heading mb-4">Especificações</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Material:</span>
                  <span className="text-muted-foreground">{product.specifications.material}</span>
                </div>
                {product.specifications.capacity && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Capacidade:</span>
                    <span className="text-muted-foreground">{product.specifications.capacity}</span>
                  </div>
                )}
                {product.specifications.dimensions && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Dimensões:</span>
                    <span className="text-muted-foreground">{product.specifications.dimensions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6">
              <p className="text-lg font-bold heading mb-4">Características</p>
              <ul className="space-y-2">
                {product.specifications.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="border-t border-border pt-6">
                <p className="text-lg font-bold heading mb-4">Tamanhos</p>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
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

            {/* CTA */}
            <div className="border-t border-border pt-6 flex gap-3">
              <Button
                onClick={() => {
                  // Aqui você pode adicionar lógica de contato via WhatsApp
                  const message = `Olá! Tenho interesse no produto: ${product.name}${
                    selectedColor ? ` na cor ${selectedColor}` : ''
                  }${selectedSize ? ` no tamanho ${selectedSize}` : ''}. Gostaria de saber mais sobre preços e disponibilidade.`;
                  const whatsappUrl = `https://wa.me/5566996066814?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 text-base py-6 font-bold"
              >
                Solicitar Orçamento
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="px-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
