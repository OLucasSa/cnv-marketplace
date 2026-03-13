import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Edit2, Trash2, Plus, Check, X } from 'lucide-react';

interface CategoryForm {
  name: string;
  visible: boolean;
}

export default function CategoryManager() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    visible: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Queries
  const { data: categories = [], refetch } = trpc.categories.listAll.useQuery();
  const utils = trpc.useUtils();

  // Mutations
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', visible: true });
      setSuccess('Categoria criada com sucesso!');
      // Invalidar caches para atualizar em toda a aplicação
      utils.categories.list.invalidate();
      utils.categories.listAll.invalidate();
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    },
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setFormData({ name: '', visible: true });
      setSuccess('Categoria atualizada com sucesso!');
      // Invalidar caches para atualizar em toda a aplicação
      utils.categories.list.invalidate();
      utils.categories.listAll.invalidate();
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    },
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      setSuccess('Categoria deletada com sucesso!');
      // Invalidar caches para atualizar em toda a aplicação
      utils.categories.list.invalidate();
      utils.categories.listAll.invalidate();
      utils.products.list.invalidate();
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    },
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError('Nome da categoria é obrigatório');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      visible: category.visible === 1,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', visible: true });
    setError(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta categoria? Os produtos vinculados serão desvinculados.')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Gerenciar Categorias
        </h2>
        <p className="text-muted-foreground">
          Crie, edite e organize as categorias de produtos do seu marketplace
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-secondary/50 border border-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Nome da Categoria
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Canecas de Alumínio"
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="visible"
            checked={formData.visible}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="visible" className="text-sm font-medium text-foreground cursor-pointer">
            Visível no marketplace
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {editingId ? 'Atualizar' : 'Criar'} Categoria
          </Button>
          {editingId && (
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Categorias Existentes</h3>
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma categoria criada ainda.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg p-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.visible === 1 ? '✓ Visível' : '✗ Oculta'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleEdit(category)}
                    variant="ghost"
                    size="sm"
                    disabled={editingId !== null || deleteMutation.isPending}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(category.id)}
                    variant="ghost"
                    size="sm"
                    disabled={editingId !== null || deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
