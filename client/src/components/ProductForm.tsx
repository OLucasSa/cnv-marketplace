import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  productId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = [
  "Canecas de Alumínio",
  "Linha Premium",
  "Porcelanas",
  "Vidros",
  "Acrílicos",
];

export default function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
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

  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const { data: product } = trpc.products.getById.useQuery(productId || 0, {
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || "",
        colors: product.colors || "",
        sizes: product.sizes || "",
        specifications: product.specifications || "",
        features: product.features || "",
        status: product.status as "active" | "inactive",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      if (productId) {
        await updateMutation.mutateAsync({
          id: productId,
          ...formData,
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Produto criado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar produto");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ImageUpload
          onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
          currentImageUrl={formData.imageUrl}
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
      </div>

      <div>
        <Label htmlFor="colors">Cores (JSON)</Label>
        <Textarea
          id="colors"
          value={formData.colors}
          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
          placeholder='[{"name": "Vermelho", "hex": "#FF0000"}]'
          rows={2}
        />
      </div>

      <div className="flex gap-3 justify-end">
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
