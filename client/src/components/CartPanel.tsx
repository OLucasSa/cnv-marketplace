import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const { items, removeItem, updateQuantity, getTotalItems } = useCart();

  const handleRequestQuote = () => {
    if (items.length === 0) {
      alert('Carrinho vazio');
      return;
    }

    let message = 'Olá, gostaria de solicitar orçamento para os seguintes produtos:\n\n';

    items.forEach((item) => {
      message += `Produto: ${item.productName}\n`;
      message += `Cor: ${item.color}\n`;
      message += `Quantidade: ${item.quantity}\n\n`;
    });

    const whatsappUrl = `https://wa.me/5566996066814?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold heading">Carrinho ({getTotalItems()})</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-muted-foreground mb-2">Carrinho vazio</p>
                <p className="text-xs text-muted-foreground">Adicione produtos para continuar</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.color}`} className="border border-border rounded-lg p-3 space-y-3">
                {/* Product Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">{item.productName}</h3>
                  <p className="text-sm text-muted-foreground">Cor: {item.color}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="flex-1 text-center font-semibold">{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => removeItem(item.productId, item.color)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total de itens:</span>
              <span className="text-lg font-bold text-accent">{getTotalItems()}</span>
            </div>
            <Button
              onClick={handleRequestQuote}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 font-bold"
            >
              Solicitar Orçamento
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-3"
            >
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
