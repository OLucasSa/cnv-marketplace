import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductsTable from "@/components/ProductsTable";
import ProductForm from "@/components/ProductForm";
import IconUpload from "@/components/IconUpload";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_SECRET_KEY = "cnv2024admin"; // Chave secreta - MUDE ISSO!

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"products" | "icon">("products");
  const utils = trpc.useUtils();
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.all.invalidate();
      utils.products.list.invalidate();
    },
  });

  // Verificar URL secreta
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");

    if (key === ADMIN_SECRET_KEY) {
      setIsAuthorized(true);
    } else {
      // Redirecionar para home se chave inválida
      setLocation("/");
    }
  }, [setLocation]);

  if (!isAuthorized) {
    return null;
  }

  const handleCreateNew = () => {
    setEditingId(undefined);
    setIsOpen(true);
  };

  const handleEdit = (productId: number) => {
    setEditingId(productId);
    setIsOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteMutation.mutateAsync(productId);
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
      console.error(error);
    }
  };

  const handleFormSuccess = () => {
    setIsOpen(false);
    setEditingId(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold heading">
              {activeTab === "products" ? "Gerenciamento de Produtos" : "Configurar Ícone do Sistema"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "products" 
                ? "Controle total sobre seu catálogo de produtos" 
                : "Altere o ícone/logo que aparece no marketplace"}
            </p>
          </div>
          <Button 
            onClick={() => setLocation("/")} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página principal
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "products"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab("icon")}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === "icon"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ícone do Sistema
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold heading">Todos os Produtos</h2>
              <Button onClick={handleCreateNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>
            <ProductsTable
              onEdit={handleEdit}
              onDelete={handleDelete}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {/* Icon Tab */}
        {activeTab === "icon" && (
          <div>
            <IconUpload />
          </div>
        )}

        {/* Product Form Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              productId={editingId}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
