import { useState } from 'react';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden bg-white border border-border rounded-lg transition-all duration-300 hover:shadow-xl hover:border-accent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay com cores disponíveis */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-end p-4 transition-opacity duration-300">
            <div className="flex gap-2 flex-wrap">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.hex}
                  className="w-6 h-6 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-gray-600 text-white text-xs font-bold">
                  +{product.colors.length - 4}
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
            <span className="font-semibold">Material:</span> {product.specifications.material}
          </p>
          {product.specifications.capacity && (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Capacidade:</span> {product.specifications.capacity}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Cores:</span> {product.colors.length} disponíveis
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onViewDetails(product)}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 group/btn"
        >
          Ver Detalhes
          <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>

      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 transform rotate-45 -translate-y-6 -translate-x-6 transition-all duration-300 group-hover:scale-150" />
    </div>
  );
}
