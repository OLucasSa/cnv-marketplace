import { useState, useEffect, useCallback, useRef } from 'react';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ColorSelector from "./ColorSelector";
import ImageGalleryManager from "./ImageGalleryManager";

interface ProductFormProps {
  productId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

// Categorias carregadas da API
// const categories = [
//   "Canecas de Alumínio",
//   "Linha Premium",
//   "Porcelanas",
//   "Vidros",
//   "Acrílicos",
// ];

export default function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "", // Mantém para compatibilidade com produtos antigos
    categoryId: "", // ID da categoria (novo)
    price: "",
    stock: 0,
    imageUrl: "",
    colors: "",
    sizes: "",
    specifications: "",
    features: "",
    status: "active" as "active" | "inactive",
  });

  const [isLoading, setIsLoading] = useState(false);
  const hasInitializedRef = useRef(false);

  const utils = trpc.useUtils();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.all.invalidate();
      utils.products.list.invalidate();
      utils.products.stats.invalidate();
    },
  });
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.all.invalidate();
      utils.products.list.invalidate();
      utils.products.stats.invalidate();
      utils.products.getById.invalidate();
    },
  });
  const { data: product } = trpc.products.getById.useQuery(productId || 0, {
    enabled: !!productId,
  });

  // Carregar categorias da API
  const { data: categories = [] } = trpc.categories.listAll.useQuery();

  // Initialize form data only once when product loads
  useEffect(() => {
    if (product && !hasInitializedRef.current) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        categoryId: product.categoryId ? String(product.categoryId) : "",
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || "",
        colors: product.colors || "",
        sizes: product.sizes || "",
        specifications: product.specifications || "",
        features: product.features || "",
        status: product.status as "active" | "inactive",
      });
      hasInitializedRef.current = true;
    }
  }, [product?.id]); // Only depend on product.id, not product object

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || !formData.price) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const categoryIdNumber = formData.categoryId ? parseInt(formData.categoryId) : undefined;
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        categoryId: categoryIdNumber,
        price: formData.price,
        stock: formData.stock,
        imageUrl: formData.imageUrl,
        colors: formData.colors,
        sizes: formData.sizes,
        specifications: formData.specifications,
        features: formData.features,
        status: formData.status,
      };

      if (productId) {
        await updateMutation.mutateAsync({
          id: productId,
          ...dataToSend,
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(dataToSend);
        toast.success("Produto criado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar produto");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, productId, updateMutation, createMutation, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Caneca Tradicional"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">Nenhuma categoria disponível</div>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço *</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Ex: R$ 50,00"
            required
          />
        </div>

        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição do produto"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-full">
        <ImageGalleryManager
          imageString={formData.imageUrl}
          onImagesChange={(imageString) => setFormData({ ...formData, imageUrl: imageString })}
        />
      </div>

      <div>
        <ColorSelector
          key={`color-selector-${productId || 'new'}`}
          value={formData.colors}
          onChange={(colorIds) => setFormData({ ...formData, colors: colorIds })}
        />
      </div>

      <div className="flex gap-3 justify-end sticky bottom-0 bg-white pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {productId ? "Atualizar" : "Criar"} Produto
        </Button>
      </div>
    </form>
  );
}
