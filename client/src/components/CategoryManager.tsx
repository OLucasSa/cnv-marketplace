import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Edit2, Trash2, Plus, Check, X } from 'lucide-react';

interface CategoryForm {
  name: string;
  slug: string;
  visible: boolean;
}

export default function CategoryManager() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    slug: '',
    visible: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Queries
  const { data: categories = [], refetch } = trpc.categories.listAll.useQuery();

  // Mutations
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', slug: '', visible: true });
      setSuccess('Categoria criada com sucesso!');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setFormData({ name: '', slug: '', visible: true });
      setSuccess('Categoria atualizada com sucesso!');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      setSuccess('Categoria deletada com sucesso!');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug é obrigatório');
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
      slug: category.slug,
      visible: category.visible === 1,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', visible: true });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nome da Categoria
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Canecas de Alumínio"
              disabled={createMutation.isPending || updateMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Slug (URL)
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Ex: canecas-aluminio"
              disabled={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="visible"
            checked={formData.visible}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="w-4 h-4"
          />
          <label htmlFor="visible" className="text-sm font-semibold text-foreground cursor-pointer">
            Visível no marketplace
          </label>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
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
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Categorias Existentes</h3>

        {categories.length === 0 ? (
          <div className="bg-secondary/50 border border-border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">Nenhuma categoria criada ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-secondary/50 border border-border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-foreground">{category.name}</h4>
                    {category.visible === 1 ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Slug: <code className="bg-background px-2 py-1 rounded">{category.slug}</code>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                    disabled={editingId !== null}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                    disabled={editingId !== null || deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Dica:</strong> Ao deletar uma categoria, todos os produtos vinculados a ela serão desvinculados e continuarão aparecendo na categoria "Todos". As categorias ocultas (não visíveis) continuam disponíveis no painel administrativo, mas não aparecem no marketplace.
        </p>
      </div>
    </div>
  );
}
