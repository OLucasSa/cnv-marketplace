import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductsTable from "@/components/ProductsTable";
import ProductForm from "@/components/ProductForm";
import BannerSettings from "@/components/BannerSettings";
import LogoSettings from "@/components/LogoSettings";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_SECRET_KEY = "cnv2024admin"; // Chave secreta - MUDE ISSO!

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
              Gerenciamento de Produtos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Controle total sobre seu catálogo de produtos
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
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList className="bg-secondary/10 border border-border mb-6">
            <TabsTrigger value="produtos" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Banner
            </TabsTrigger>
            <TabsTrigger value="logo" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Logo/Ícone
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="produtos" className="space-y-6">
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
          </TabsContent>

          {/* Banner Tab */}
          <TabsContent value="banner" className="space-y-6">
            <BannerSettings />
          </TabsContent>

          {/* Logo Tab */}
          <TabsContent value="logo" className="space-y-6">
            <LogoSettings />
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1">
              <ProductForm
                productId={editingId}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
