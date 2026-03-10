import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { parseColorIds, COLOR_PALETTE } from '../../../shared/colors';

interface ColorPreset {
  id: number;
  name: string;
  colors: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ColorPresetsManagerProps {
  onSelectPreset?: (colors: string) => void;
}

export default function ColorPresetsManager({ onSelectPreset }: ColorPresetsManagerProps) {
  const [presets, setPresets] = useState<ColorPreset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    colors: '',
    description: '',
  });

  const presetsQuery = trpc.colorPresets.list.useQuery();
  const createMutation = trpc.colorPresets.create.useMutation();
  const updateMutation = trpc.colorPresets.update.useMutation();
  const deleteMutation = trpc.colorPresets.delete.useMutation();

  useEffect(() => {
    if (presetsQuery.data) {
      setPresets(presetsQuery.data as ColorPreset[]);
    }
  }, [presetsQuery.data]);

  const handleOpenDialog = (preset?: ColorPreset) => {
    if (preset) {
      setEditingId(preset.id);
      setFormData({
        name: preset.name,
        colors: preset.colors,
        description: preset.description || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', colors: '', description: '' });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.colors) {
      alert('Nome e cores são obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          colors: formData.colors,
          description: formData.description,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          colors: formData.colors,
          description: formData.description,
        });
      }
      
      // Refetch presets
      presetsQuery.refetch();
      setIsOpen(false);
      setFormData({ name: '', colors: '', description: '' });
    } catch (error) {
      console.error('Erro ao salvar preset:', error);
      alert('Erro ao salvar preset');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este preset?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      presetsQuery.refetch();
    } catch (error) {
      console.error('Erro ao deletar preset:', error);
      alert('Erro ao deletar preset');
    }
  };

  const handleSelectPreset = (colors: string) => {
    if (onSelectPreset) {
      onSelectPreset(colors);
    }
  };

  const selectedColorIds = parseColorIds(formData.colors);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Presets de Cores</h3>
        <Button onClick={() => handleOpenDialog()} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Preset
        </Button>
      </div>

      {presets.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum preset criado ainda. Crie um novo preset para começar.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {presets.map((preset) => {
            const colorIds = parseColorIds(preset.colors);
            const colors = colorIds.map((id: number) => COLOR_PALETTE.find((c: any) => c.id === id)).filter(Boolean);

            return (
              <div key={preset.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{preset.name}</h4>
                    {preset.description && (
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDialog(preset)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(preset.id)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {colors.map((color: any) => (
                    <div
                      key={color.id}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                      title={color.displayName}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPreset(preset.colors)}
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  Aplicar Preset
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar Preset' : 'Novo Preset de Cores'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do Preset *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cores Quentes"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional do preset"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Selecionar Cores *</label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PALETTE.map((color: any) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      const ids = parseColorIds(formData.colors);
                      const isSelected = ids.includes((color as any).id);
                      const newIds = isSelected
                        ? ids.filter((id: number) => id !== (color as any).id)
                        : [...ids, (color as any).id];
                      setFormData({
                        ...formData,
                        colors: newIds.join(','),
                      });
                    }}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${
                      selectedColorIds.includes((color as any).id)
                        ? 'border-black scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: (color as any).hex }}
                    title={(color as any).displayName}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedColorIds.length} cor(es) selecionada(s)
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!formData.name || !formData.colors}>
                {editingId ? 'Atualizar' : 'Criar'} Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
