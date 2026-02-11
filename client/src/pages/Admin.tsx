import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Settings as SettingsIcon } from "lucide-react";
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
import Settings from "./Settings";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"products" | "users" | "settings">("products");
  const deleteMutation = trpc.products.delete.useMutation();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'editor'))) {
      setLocation('/');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
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
              {activeTab === "products" && "Gerenciamento de Produtos"}
              {activeTab === "users" && "Gerenciar Usuários"}
              {activeTab === "settings" && "Configurações"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === "products" && "Controle total sobre seu catálogo de produtos"}
              {activeTab === "users" && "Gerencie roles e permissões dos usuários"}
              {activeTab === "settings" && "Configure seu marketplace"}
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
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Produtos
          </button>
          {user.role === "admin" && (
            <>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "users"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                Usuários
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "settings"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </button>
            </>
          )}
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

        {/* Users Tab - Admin only */}
        {activeTab === "users" && user.role === "admin" && (
          <div>
            <h2 className="text-xl font-bold heading mb-4">Todos os Usuários</h2>
            <UsersTable />
          </div>
        )}

        {/* Settings Tab - Admin only */}
        {activeTab === "settings" && user.role === "admin" && (
          <Settings />
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
