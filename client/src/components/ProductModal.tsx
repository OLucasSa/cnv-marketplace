import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check, ShoppingCart, Info, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import ProductImageGallery from './ProductImageGallery';
import ImageLightbox from './ImageLightbox';
import { parseColorIds, COLOR_PALETTE } from '@shared/colors';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  // Parse images
  const images = product.imageUrl
    ? product.imageUrl
        .split('|')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0)
    : [];

  const hasSizes = product.sizes && product.sizes.length > 0;
  
  // Parse colors - handle both string IDs and array formats
  let colors: (typeof COLOR_PALETTE)[number][] = [];
  if (typeof product.colors === 'string') {
    const colorIds = parseColorIds(product.colors);
    colors = colorIds
      .map(id => COLOR_PALETTE.find(c => c.id === id))
      .filter((c): c is (typeof COLOR_PALETTE)[number] => Boolean(c));
  } else if (Array.isArray(product.colors)) {
    colors = product.colors
      .map(c => COLOR_PALETTE.find(p => p.hex === c.hex))
      .filter((c): c is (typeof COLOR_PALETTE)[number] => Boolean(c));
  }

  const handleImageClick = (imageUrl: string) => {
    const index = images.indexOf(imageUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert('Por favor, selecione uma cor');
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      image: images[0] || '',
      color: selectedColor,
      quantity,
      price: typeof product.price === 'number' ? product.price : undefined,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setTimeout(onClose, 0);
        }
      }}>
        <DialogContent key={product.id} className="max-w-[1100px] max-h-[85vh] overflow-y-auto p-0 gap-0 md:rounded-lg rounded-none md:max-h-[85vh] max-h-screen md:max-w-[90vw]">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-white border-b border-border p-4 md:p-6 flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-4xl font-bold heading mb-1 md:mb-2">
                {product.name}
              </DialogTitle>
              <p className="text-xs md:text-sm text-accent uppercase tracking-wider font-semibold">
                {product.category || 'Sem categoria'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-secondary/20 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
              {/* Left: Images - Takes 3 columns on desktop */}
              <div className="lg:col-span-3">
                <ProductImageGallery 
                  images={images} 
                  productName={product.name}
                  onImageClick={handleImageClick}
                />
              </div>

              {/* Right: Product Info - Takes 2 columns on desktop */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                {/* Price */}
                <div className="bg-accent/10 border-2 border-accent rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Preço</p>
                  <p className="text-xl md:text-3xl font-bold text-accent">
                    {typeof product.price === 'string' ? product.price : `R$ ${product.price}`}
                  </p>
                </div>

                {/* Description */}
                <div className="bg-secondary/5 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-accent" />
                    Descrição
                  </p>
                  <p className="text-xs md:text-sm text-foreground leading-relaxed line-clamp-5">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="bg-secondary/5 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm font-semibold text-foreground mb-3">Quantidade</p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="flex-1 text-center border border-border rounded-lg py-2 px-2 text-sm md:text-base font-semibold"
                    />
                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-2">
                  {addedToCart && (
                    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold text-center">
                      ✓ Produto adicionado ao carrinho
                    </div>
                  )}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm md:text-base py-4 md:py-5 font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button
                    onClick={() => {
                      const message = `Olá! Tenho interesse no produto: ${product.name}${
                        selectedColor ? ` na cor ${selectedColor}` : ''
                      }${selectedSize ? ` no tamanho ${selectedSize}` : ''}. Gostaria de saber mais sobre preços e disponibilidade.`;
                      const whatsappUrl = `https://wa.me/5566996066814?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm md:text-base py-4 md:py-5 font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    Solicitar Orçamento
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full py-4 md:py-5 text-sm md:text-base"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Colors and Sizes/Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-border pt-6 md:pt-8 mt-6 md:mt-8">
              {/* Colors - Left Column */}
              <div>
                <p className="text-sm md:text-lg font-bold heading mb-3 md:mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 md:h-6 bg-accent rounded-full" />
                  Cores Disponíveis
                </p>
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {colors && colors.length > 0 ? (
                    colors.map((color: typeof COLOR_PALETTE[number]) => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color.displayName)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 relative group`}
                        title={color.displayName}
                      >
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 transition-all ${
                            selectedColor === color.displayName
                              ? 'border-accent shadow-md ring-2 ring-accent'
                              : 'border-border hover:border-accent'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        {selectedColor === color.displayName && (
                          <Check className="w-3 h-3 text-accent absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                        <span className="text-[9px] text-center font-medium text-foreground line-clamp-1 hidden group-hover:block absolute -bottom-6 bg-foreground text-background px-2 py-1 rounded whitespace-nowrap z-10">
                          {color.displayName}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-muted-foreground col-span-6">Sem cores</p>
                  )}
                </div>
              </div>

              {/* Sizes & Features - Right Column */}
              <div className="space-y-4 md:space-y-6">
                {/* Sizes */}
                {hasSizes && (
                  <div>
                    <p className="text-sm md:text-lg font-bold heading mb-2 md:mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 md:h-6 bg-accent rounded-full" />
                      Tamanhos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes!.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 md:px-4 py-2 rounded-lg border-2 transition-all font-semibold text-xs md:text-sm ${
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

                {/* Features */}
                {product.specifications.features && product.specifications.features.length > 0 && (
                  <div>
                    <p className="text-sm md:text-lg font-bold heading mb-2 md:mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 md:h-6 bg-accent rounded-full" />
                      Características
                    </p>
                    <div className="space-y-2">
                      {product.specifications.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-secondary/5 rounded-lg p-2 md:p-3">
                          <div className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                          <span className="text-xs md:text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        productName={product.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
