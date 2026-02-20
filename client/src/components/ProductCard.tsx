import { useState } from 'react';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import { COLOR_PALETTE, parseColorIds } from '@shared/colors';

interface ProductCardProps {
  product: any;
  onViewDetails: (product: any) => void;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extrair primeira imagem do imageUrl (pipe-separated)
  let firstImage: string | null = null;
  if (product.imageUrl && typeof product.imageUrl === 'string') {
    const images = product.imageUrl.split('|').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
    firstImage = images.length > 0 ? images[0] : null;
  }
  
  // Fallback para product.image se existir
  const imageUrl = firstImage || (product.image && product.image.trim() ? product.image : null);

  // Parse colors usando parseColorIds (espera "1,2,3")
  const colorIds = parseColorIds(product.colors);
  const colors = colorIds.map(id => COLOR_PALETTE.find(c => c.id === id)).filter(Boolean);

  // Parse specifications com fallback
  const specifications = typeof product.specifications === 'string'
    ? JSON.parse(product.specifications)
    : product.specifications || { material: 'Personalizado' };

  return (
    <div
      className="group relative overflow-hidden bg-white border border-border rounded-lg transition-all duration-300 hover:shadow-xl hover:border-accent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
            <span className="text-sm">Sem imagem</span>
          </div>
        )}
        {/* Overlay com cores disponíveis */}
        {isHovered && colors.length > 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-end p-4 transition-opacity duration-300">
            <div className="flex gap-2 flex-wrap">
              {colors.slice(0, 4).map((color: any) => (
                <div
                  key={color.hex}
                  className="w-6 h-6 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {colors.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 text-white text-xs font-bold">
                  +{colors.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
          {product.category}
        </p>
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 heading">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>
        {/* Specifications Preview */}
        <div className="mb-4 space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Material:</span> {specifications.material || 'Personalizado'}
          </p>
          {specifications.capacity && (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Capacidade:</span> {specifications.capacity}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Cores:</span> {colors.length} disponíveis
          </p>
        </div>
        {/* CTA Button */}
        <Button
          onClick={() => onViewDetails(product)}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 group/btn"
        >
          Ver Detalhes
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
