import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductsTable from "@/components/ProductsTable";
import ProductForm from "@/components/ProductForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const deleteMutation = trpc.products.delete.useMutation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
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

  if (!user || user.role !== 'admin') {
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
            <h1 className="text-3xl font-bold heading">Gerenciamento de Produtos</h1>
            <p className="text-muted-foreground mt-2">Controle total sobre seu catálogo de produtos</p>
          </div>
          <Button onClick={handleCreateNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

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
    </DashboardLayout>
  );
}
