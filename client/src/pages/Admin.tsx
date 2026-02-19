import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductsTable from "@/components/ProductsTable";
import ProductForm from "@/components/ProductForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import UsersTable from "@/components/UsersTable";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_SECRET_KEY = "cnv2024admin"; // Chave secreta - MUDE ISSO!

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");
  const deleteMutation = trpc.products.delete.useMutation();

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
      setRefreshTrigger(prev => prev + 1);
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
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold heading">
              {activeTab === "products" ? "Gerenciamento de Produtos" : "Gerenciar Usuários"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === "products" 
                ? "Controle total sobre seu catálogo de produtos" 
                : "Gerencie roles e permissões dos usuários"}
            </p>
          </div>
          {activeTab === "products" && (
            <Button onClick={handleCreateNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
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
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "users"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Usuários
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            {/* Metrics */}
            <DashboardMetrics />
            {/* Products Table */}
            <div>
              <h2 className="text-xl font-bold heading mb-4">Todos os Produtos</h2>
              <ProductsTable
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-bold heading mb-4">Todos os Usuários</h2>
            <UsersTable />
          </div>
        )}

        {/* Product Form Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
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
    </DashboardLayout>
  );
}
